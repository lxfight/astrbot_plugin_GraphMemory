(function() {
    'use strict';
    
    const state = {
        isLoggedIn: false,
        isDark: localStorage.getItem('theme') !== 'light',
        sidebarOpen: true,
        activeTab: 'info',
        graphData: { nodes: [], links: [] },
        currentSessionId: null,
        selectedNode: null,
        hoverNode: null,
        highlightNodes: new Set(),
        highlightLinks: new Set(),
        debugResult: null,
        showLabels: true,
        Graph: null,
        isConnecting: false,
        connectionStartNode: null,
        isEditingNode: false,
        ws: null,
        logPaused: false,
        logLevel: 'ALL',
        logCache: []
    };
    
    const el = {
        loginScreen: document.getElementById('login-screen'),
        loginKey: document.getElementById('login-key'),
        loginBtn: document.getElementById('login-btn'),
        loginError: document.getElementById('login-error'),
        mainApp: document.getElementById('main-app'),
        themeToggle: document.getElementById('theme-toggle'),
        logoutBtn: document.getElementById('logout-btn'),
        sidebarToggle: document.getElementById('sidebar-toggle-btn'),
        sidebar: document.getElementById('sidebar'),
        searchInput: document.getElementById('search-input'),
        sessionSelector: document.getElementById('session-selector'),
        tabInfo: document.getElementById('tab-info'),
        tabDebug: document.getElementById('tab-debug'),
        tabMonitor: document.getElementById('tab-monitor'),
        nodeInfoEmpty: document.getElementById('node-info-empty'),
        nodeInfoDetail: document.getElementById('node-info-detail'),
        debugQuery: document.getElementById('debug-query'),
        debugSearchBtn: document.getElementById('debug-search-btn'),
        debugLoader: document.getElementById('debug-loader'),
        debugText: document.getElementById('debug-text'),
        debugResult: document.getElementById('debug-result'),
        debugStats: document.getElementById('debug-stats'),
        debugJson: document.getElementById('debug-json'),
        visualizeBtn: document.getElementById('visualize-btn'),
        graphContainer: document.getElementById('graph-container'),
        nodeCount: document.getElementById('node-count'),
        edgeCount: document.getElementById('edge-count'),
        showLabels: document.getElementById('show-labels'),
        reloadBtn: document.getElementById('reload-btn'),
        fitViewBtn: document.getElementById('fit-view-btn'),
        tooltip: document.getElementById('tooltip'),
        monitorLogs: document.getElementById('monitor-logs'),
        monitorTasks: document.getElementById('monitor-tasks'),
        monitorMessages: document.getElementById('monitor-messages'),
        logLevelFilter: document.getElementById('log-level-filter'),
        logPauseToggle: document.getElementById('log-pause-toggle'),
        logClear: document.getElementById('log-clear'),
        toolsBtn: document.getElementById('tools-btn'),
        linkEntityBtn: document.getElementById('link-entity-btn'),
        connectNodesBtn: document.getElementById('connect-nodes-btn'),
        rightPanel: document.getElementById('right-panel'),
        rightPanelClose: document.getElementById('right-panel-close'),
        rightPanelContent: document.getElementById('right-panel-content'),
        toastContainer: document.getElementById('toast-container')
    };
    
    function getAuthHeaders() {
        const token = sessionStorage.getItem('session_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    
    // Toast 通知系统
    function showToast(title, message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        
        toast.innerHTML = `
            <i data-lucide="${iconMap[type]}" class="toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close">
                <i data-lucide="x" style="width: 1rem; height: 1rem;"></i>
            </button>
        `;
        
        el.toastContainer.appendChild(toast);
        lucide.createIcons();
        
        const closeBtn = toast.querySelector('.toast-close');
        const removeToast = () => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        };
        
        closeBtn.addEventListener('click', removeToast);
        
        if (duration > 0) {
            setTimeout(removeToast, duration);
        }
        
        return toast;
    }

    // 右侧面板管理
    function openRightPanel(content) {
        el.rightPanelContent.innerHTML = content;
        el.rightPanel.classList.add('open');
        lucide.createIcons();
    }

    function closeRightPanel() {
        el.rightPanel.classList.remove('open');
        setTimeout(() => {
            el.rightPanelContent.innerHTML = '';
        }, 400);
    }
    
    async function checkSession() {
        let token = sessionStorage.getItem('session_token');
        if (token) {
            try {
                const res = await fetch('/api/contexts', { headers: getAuthHeaders() });
                if (res.ok) {
                    state.isLoggedIn = true;
                    showMainApp();
                    return;
                }
            } catch (e) {
                console.error('会话验证失败:', e);
            }
            sessionStorage.removeItem('session_token');
        }
    }
    
    async function login() {
        const key = el.loginKey.value.trim();
        if (!key) return;
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.token) sessionStorage.setItem('session_token', data.token);
                state.isLoggedIn = true;
                el.loginError.textContent = '';
                showMainApp();
            } else {
                el.loginError.textContent = '访问密钥无效';
            }
        } catch (e) {
            el.loginError.textContent = '连接错误: ' + e.message;
        }
    }

    function showBatchOperationsPanel() {
        const content = `
            <div class="tool-section">
                <div class="tool-section-title">批量操作</div>
                <div class="tool-item" data-task="delete_isolated_entities">
                    <i data-lucide="trash-2" class="tool-item-icon"></i>
                    <div class="tool-item-content">
                        <div class="tool-item-title">删除孤立实体</div>
                        <div class="tool-item-desc">清理没有任何连接的节点</div>
                    </div>
                </div>
                <div class="tool-item" data-task="delete_old_messages" data-days="90">
                    <i data-lucide="clock" class="tool-item-icon"></i>
                    <div class="tool-item-content">
                        <div class="tool-item-title">删除旧消息</div>
                        <div class="tool-item-desc">删除90天前的原始消息</div>
                    </div>
                </div>
            </div>
            <div id="batch-op-status" class="status-message hidden"></div>
        `;
        openRightPanel(content);

        document.querySelectorAll('.tool-item[data-task]').forEach(item => {
            item.addEventListener('click', async (e) => {
                const taskName = e.currentTarget.dataset.task;
                const days = e.currentTarget.dataset.days;
                const statusEl = document.getElementById('batch-op-status');
                
                statusEl.classList.remove('hidden', 'success', 'error');
                statusEl.textContent = `正在执行任务...`;
                
                try {
                    const params = days ? { days: parseInt(days) } : {};
                    const res = await fetch('/api/batch-delete', {
                        method: 'POST',
                        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ task_name: taskName, params: params })
                    });

                    if (!res.ok) throw new Error(`服务器错误: ${res.statusText}`);
                    
                    const result = await res.json();
                    statusEl.classList.add('success');
                    statusEl.textContent = `成功删除 ${result.deleted_count} 个节点`;
                    
                    showToast('操作成功', `已删除 ${result.deleted_count} 个节点`, 'success');
                    
                    setTimeout(() => {
                        closeRightPanel();
                        el.reloadBtn.click();
                    }, 2000);

                } catch (err) {
                    statusEl.classList.add('error');
                    statusEl.textContent = `错误: ${err.message}`;
                    showToast('操作失败', err.message, 'error');
                }
            });
        });
    }

    function showLinkEntityPanel() {
        if (!state.selectedNode || state.selectedNode.type !== 'Entity') {
            showToast('无法关联', '请先选择一个实体节点', 'warning');
            return;
        }
        
        const entityName = state.selectedNode.name;
        const content = `
            <div class="tool-section">
                <div class="tool-section-title">关联实体到会话</div>
                <p style="font-size: 0.875rem; color: #666; margin-bottom: 1.5rem;">
                    将实体 <strong>${entityName}</strong> 关联到指定会话
                </p>
                <div class="form-group">
                    <label class="form-label">目标会话 ID</label>
                    <input type="text" id="link-session-id" class="form-input" 
                           value="${state.currentSessionId !== 'global' ? state.currentSessionId : ''}" 
                           placeholder="输入会话ID...">
                </div>
                <button id="confirm-link-btn" class="btn btn-primary">确认关联</button>
                <div id="link-status" class="status-message hidden"></div>
            </div>
        `;
        openRightPanel(content);
        
        document.getElementById('confirm-link-btn').addEventListener('click', async () => {
            const sessionId = document.getElementById('link-session-id').value.trim();
            const statusEl = document.getElementById('link-status');
            
            if (!sessionId) {
                statusEl.classList.remove('hidden', 'success');
                statusEl.classList.add('error');
                statusEl.textContent = '请输入会话 ID';
                return;
            }
            
            statusEl.classList.remove('hidden', 'success', 'error');
            statusEl.textContent = '正在关联...';
            
            try {
                const res = await fetch('/api/link', {
                    method: 'POST',
                    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId, entity_name: entityName })
                });
                
                if (!res.ok) throw new Error(`服务器错误: ${res.statusText}`);
                
                statusEl.classList.add('success');
                statusEl.textContent = '关联成功！';
                showToast('关联成功', `实体已关联到会话 ${sessionId}`, 'success');
                
                setTimeout(() => {
                    closeRightPanel();
                    if (state.currentSessionId === sessionId) {
                        el.reloadBtn.click();
                    }
                }, 1500);
            } catch (err) {
                statusEl.classList.add('error');
                statusEl.textContent = `错误: ${err.message}`;
                showToast('关联失败', err.message, 'error');
            }
        });
    }

    function showConnectNodesPanel(fromNode, toNode) {
        const content = `
            <div class="tool-section">
                <div class="tool-section-title">连接节点</div>
                <p style="font-size: 0.875rem; color: #666; margin-bottom: 1.5rem;">
                    创建从 <strong>${fromNode.name}</strong> 到 <strong>${toNode.name}</strong> 的关系
                </p>
                <div class="form-group">
                    <label class="form-label">关系类型</label>
                    <input type="text" id="relation-type-input" class="form-input" 
                           placeholder="例如: IS_A, PART_OF, RELATED_TO">
                </div>
                <button id="confirm-connect-btn" class="btn btn-primary">创建关系</button>
                <div id="connect-status" class="status-message hidden"></div>
            </div>
        `;
        openRightPanel(content);

        document.getElementById('confirm-connect-btn').addEventListener('click', async () => {
            const relType = document.getElementById('relation-type-input').value.trim();
            const statusEl = document.getElementById('connect-status');
            if (!relType) {
                statusEl.classList.remove('hidden', 'success');
                statusEl.classList.add('error');
                statusEl.textContent = '请输入关系名称';
                return;
            }
            await createEdge(fromNode, toNode, relType, statusEl);
        });
    }

    async function createEdge(fromNode, toNode, relType, statusEl) {
        statusEl.classList.remove('hidden', 'success', 'error');
        statusEl.textContent = '正在创建关系...';
        
        try {
            const payload = {
                from_id: fromNode.id,
                to_id: toNode.id,
                rel_type: relType,
                from_type: fromNode.type,
                to_type: toNode.type
            };
            const res = await fetch('/api/edge', {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || `服务器错误: ${res.statusText}`);
            }

            statusEl.classList.add('success');
            statusEl.textContent = '关系创建成功！';
            showToast('创建成功', `已创建 ${relType} 关系`, 'success');
            
            setTimeout(() => {
                closeRightPanel();
                el.reloadBtn.click();
            }, 1500);

        } catch (err) {
            statusEl.classList.add('error');
            statusEl.textContent = `错误: ${err.message}`;
            showToast('创建失败', err.message, 'error');
        }
    }

    function logout() {
        state.isLoggedIn = false;
        sessionStorage.removeItem('session_token');
        document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (state.Graph) {
            state.Graph._destructor();
            state.Graph = null;
        }
        el.mainApp.classList.add('hidden');
        el.loginScreen.classList.remove('hidden');
    }
    
    function showMainApp() {
        el.loginScreen.classList.add('hidden');
        el.mainApp.classList.remove('hidden');
        initApp();
        connectWebSocket();
    }
    
    function toggleTheme() {
        state.isDark = !state.isDark;
        localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
        document.body.classList.toggle('dark', state.isDark);
        
        el.themeToggle.innerHTML = `<i data-lucide="${state.isDark ? 'sun' : 'moon'}" style="width: 1rem; height: 1rem;"></i>`;
        lucide.createIcons();
        
        if (state.Graph) {
            const bgColor = state.isDark ? '#080808' : '#f2f2f2';
            state.Graph.backgroundColor(bgColor);
            state.Graph.nodeColor(state.Graph.nodeColor());
            state.Graph.linkColor(state.Graph.linkColor());
            state.Graph.nodeCanvasObject(state.Graph.nodeCanvasObject());
        }
    }
    
    function toggleSidebar() {
        state.sidebarOpen = !state.sidebarOpen;
        if (state.sidebarOpen) {
            el.sidebar.classList.remove('closed');
            el.graphContainer.classList.remove('full');
        } else {
            el.sidebar.classList.add('closed');
            el.graphContainer.classList.add('full');
        }
        
        setTimeout(() => {
            if (state.Graph) {
                const width = el.graphContainer.clientWidth;
                const height = el.graphContainer.clientHeight;
                state.Graph.width(width);
                state.Graph.height(height);
            }
        }, 310);
    }
    
    function switchTab(tabName) {
        state.activeTab = tabName;
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        el.tabInfo.classList.toggle('hidden', tabName !== 'info');
        el.tabDebug.classList.toggle('hidden', tabName !== 'debug');
        el.tabMonitor.classList.toggle('hidden', tabName !== 'monitor');
    }
    
    function initGraph() {
        if (state.Graph) return;
        el.graphContainer.innerHTML = '';
        
        const getNodeColor = (node) => {
            if (state.highlightNodes.size > 0 && !state.highlightNodes.has(node.id)) {
                return state.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            }
            if (node === state.selectedNode) return state.isDark ? '#fff' : '#000';
            
            const type = (node.type || '').toLowerCase();
            
            if (type.includes('concept') || type.includes('memory')) return '#818cf8';
            if (type.includes('action') || type.includes('event')) return '#34d399';
            if (type.includes('persona') || type.includes('user')) return '#60a5fa';
            if (type.includes('loc') || type.includes('place')) return '#f472b6';
            if (type.includes('time') || type.includes('date')) return '#fcd34d';
            
            return '#9ca3af';
        };
        
        const getLinkColor = (link) => {
            const isDimmed = state.highlightLinks.size > 0 && !state.highlightLinks.has(link);
            
            if (isDimmed) {
                return state.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
            }
            return state.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        };
        
        state.Graph = ForceGraph()(el.graphContainer)
            .backgroundColor(state.isDark ? '#080808' : '#f2f2f2')
            .nodeLabel('name')
            .nodeColor(getNodeColor)
            .nodeVal(node => (node.importance || 0.5) * 5)
            .nodeRelSize(4)
            .linkColor(getLinkColor)
            .linkWidth(link => state.highlightLinks.has(link) ? 2.5 : 1)
            .linkDirectionalParticles(link => state.highlightLinks.has(link) ? 3 : 0)
            .linkDirectionalParticleWidth(3)
            .onNodeClick(node => {
                if (state.isConnecting) {
                    if (!state.connectionStartNode) {
                        state.connectionStartNode = node;
                        showToast('已选择起始节点', `${node.name}，请点击第二个节点`, 'info', 3000);
                        highlightNetwork(node);
                    } else {
                        if (state.connectionStartNode.id === node.id) {
                            showToast('无法连接', '不能连接节点自身', 'warning');
                            return;
                        }
                        showConnectNodesPanel(state.connectionStartNode, node);
                        state.isConnecting = false;
                        state.connectionStartNode = null;
                        el.connectNodesBtn.classList.remove('active');
                        el.connectNodesBtn.innerHTML = `<i data-lucide="share-2" style="width: 0.875rem; height: 0.875rem;"></i><span>连接节点</span>`;
                        lucide.createIcons();
                    }
                } else {
                    state.selectedNode = node;
                    highlightNetwork(node);
                    focusNode(node);
                    switchTab('info');
                    if (!state.sidebarOpen) toggleSidebar();
                    renderNodeInfo();
                }
            })
            .onNodeHover(node => {
                state.hoverNode = node;
                el.graphContainer.style.cursor = node ? 'pointer' : null;
                if (node) {
                    el.tooltip.textContent = `${node.name} (${node.type})`;
                    el.tooltip.classList.remove('hidden');
                } else {
                    el.tooltip.classList.add('hidden');
                }
            })
            .onBackgroundClick(() => {
                state.selectedNode = null;
                state.highlightNodes.clear();
                state.highlightLinks.clear();
                state.Graph.nodeColor(state.Graph.nodeColor());
                state.Graph.linkColor(state.Graph.linkColor());
                state.Graph.linkDirectionalParticles(0);
                renderNodeInfo();
            })
            .nodeCanvasObject((node, ctx, globalScale) => {
                const r = Math.sqrt(Math.max(0, (node.importance || 0.5) * 5)) * 4;
                const isSelected = node === state.selectedNode;
                const isHighlighted = state.highlightNodes.has(node.id);
                const isDimmed = state.highlightNodes.size > 0 && !isHighlighted;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                ctx.fillStyle = isDimmed ? (state.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : getNodeColor(node);
                ctx.fill();
                
                if (isSelected) {
                    ctx.strokeStyle = state.isDark ? '#fff' : '#333';
                    ctx.lineWidth = 2 / globalScale;
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, r * 1.5, 0, 2 * Math.PI, false);
                    ctx.strokeStyle = state.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)';
                    ctx.lineWidth = 1 / globalScale;
                    ctx.stroke();
                }
                
                if (state.showLabels || isSelected || isHighlighted) {
                    const label = node.name;
                    const fontSize = (isSelected ? 14 : 10) / globalScale;
                    ctx.font = `${isSelected ? 'bold' : ''} ${fontSize}px 'Inter', sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    
                    const currentTextColor = state.isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
                    const dimmedColor = state.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
                    
                    ctx.fillStyle = isDimmed ? dimmedColor : currentTextColor;
                    
                    if (isSelected) {
                        const textWidth = ctx.measureText(label).width;
                        const bgHeight = fontSize * 1.2;
                        ctx.fillStyle = state.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)';
                        ctx.fillRect(node.x - textWidth/2 - 2, node.y + r + 2, textWidth + 4, bgHeight);
                        ctx.fillStyle = isDimmed ? dimmedColor : currentTextColor;
                    }
                    
                    ctx.fillText(label, node.x, node.y + r + 2);
                }
            })
            .graphData(state.graphData);
        
        el.graphContainer.addEventListener('mousemove', (e) => {
            el.tooltip.style.left = e.clientX + 'px';
            el.tooltip.style.top = e.clientY + 'px';
        });

        if (!window._resizeListenerAdded) {
            window.addEventListener('resize', () => {
                if (state.Graph) {
                    state.Graph.width(el.graphContainer.clientWidth);
                    state.Graph.height(el.graphContainer.clientHeight);
                }
            });
            window._resizeListenerAdded = true;
        }
    }
    
    async function initApp() {
        initGraph();

        try {
            const res = await fetch('/api/contexts', { headers: getAuthHeaders() });
            if (!res.ok) {
                console.error('无法获取会话列表用于填充下拉菜单。');
            } else {
                const contexts = await res.json();
                console.log('获取到的会话上下文:', contexts);

                el.sessionSelector.innerHTML = '<option value="global">全局视图</option>';
                if (contexts && contexts.length > 0) {
                    contexts.forEach(ctx => {
                        const option = document.createElement('option');
                        option.value = ctx.session_id;
                        const displayName = ctx.session_id.length > 30 ? `...${ctx.session_id.slice(-27)}` : ctx.session_id;
                        option.textContent = displayName;
                        el.sessionSelector.appendChild(option);
                    });
                } else {
                    console.log('No contexts found to load.');
                }
            }
        } catch (e) {
            console.error("填充会话下拉菜单时出错:", e);
        }

        console.log("默认加载全局视图...");
        el.sessionSelector.value = 'global';
        await loadGraphData('global');
    }
    
    async function loadGraphData(sessionId) {
        console.log(`开始加载图谱数据，视图: ${sessionId}`);
        state.currentSessionId = sessionId;
        
        const url = (sessionId && sessionId !== 'global')
            ? `/api/graph?session_id=${encodeURIComponent(sessionId)}`
            : '/api/graph';

        try {
            const res = await fetch(url, { headers: getAuthHeaders() });
            if (!res.ok) {
                if (res.status === 401) {
                    console.error('认证失败，重新登录');
                    logout();
                }
                throw new Error(`Failed to load graph data for view: ${sessionId}`);
            }
            const data = await res.json();
            
            if (!data || data === null) {
                console.error('收到空的图谱数据');
                state.graphData = { nodes: [], links: [] };
                updateStats();
                return;
            }
            
            const validNodes = (data.nodes || []).filter(n => n && n.id);
            const nodeIds = new Set(validNodes.map(n => n.id));
            
            const validEdges = (data.edges || []).filter(e =>
                e && e.source && e.target && nodeIds.has(e.source) && nodeIds.has(e.target)
            );
            
            console.log(`有效节点: ${validNodes.length}, 有效边: ${validEdges.length}`);
            
            state.graphData = {
                nodes: validNodes,
                links: validEdges
            };
    
            updateStats();
            if (state.Graph) {
                state.Graph.graphData(state.graphData);
                setTimeout(() => state.Graph.zoomToFit(400), 200);
            }
    
        } catch (e) {
            console.error('加载图谱数据错误:', e);
            showToast('加载失败', '无法加载图谱数据', 'error');
        }
    }
    
    function updateStats() {
        el.nodeCount.textContent = state.graphData.nodes.length;
        el.edgeCount.textContent = state.graphData.links.length;
    }
    
    function highlightNetwork(node) {
        state.highlightNodes.clear();
        state.highlightLinks.clear();
        
        if (!node) return;
        
        state.highlightNodes.add(node.id);
        state.graphData.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            if (sourceId === node.id) {
                state.highlightLinks.add(link);
                state.highlightNodes.add(targetId);
            }
            if (targetId === node.id) {
                state.highlightLinks.add(link);
                state.highlightNodes.add(sourceId);
            }
        });
        
        state.Graph.nodeColor(state.Graph.nodeColor());
        state.Graph.linkColor(state.Graph.linkColor());
        state.Graph.linkWidth(state.Graph.linkWidth());
        state.Graph.linkDirectionalParticles(link => state.highlightLinks.has(link) ? 2 : 0);
    }
    
    function focusNode(node) {
        if (!state.Graph || !node) return;
        state.Graph.centerAt(node.x, node.y, 1000);
        state.Graph.zoom(3, 1000);
    }
    
    function renderNodeInfo() {
        if (!state.selectedNode) {
            el.nodeInfoEmpty.classList.remove('hidden');
            el.nodeInfoDetail.classList.add('hidden');
            return;
        }
        
        el.nodeInfoEmpty.classList.add('hidden');
        el.nodeInfoDetail.classList.remove('hidden');
        
        const node = state.selectedNode;
        el.nodeInfoDetail.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 id="node-name" style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">${node.name}</h3>
                <div style="display: flex; gap: 0.5rem; font-size: 0.625rem; font-family: 'Courier New', monospace; color: #666;">
                    <span id="node-type" style="padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.05); border-radius: 0.25rem;">${node.type}</span>
                    <span id="node-id" style="padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.05); border-radius: 0.25rem;">${node.id}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h4 style="font-size: 0.625rem; font-weight: 700; color: #666; letter-spacing: 0.1em; text-transform: uppercase;">Properties</h4>
                    <button id="edit-node-btn" class="icon-btn" title="Edit Properties">
                        <i data-lucide="edit" style="width: 0.875rem; height: 0.875rem;"></i>
                    </button>
                </div>
                <div id="node-properties"></div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.625rem; font-weight: 700; color: #666; margin-bottom: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Observations</h4>
                <div id="node-observations"></div>
            </div>
            
            <div>
                <h4 style="font-size: 0.625rem; font-weight: 700; color: #666; margin-bottom: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Connected Nodes</h4>
                <div id="node-neighbors"></div>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05);">
                 <button id="delete-node-btn" class="btn btn-secondary" style="background: rgba(239,68,68,0.1); color: #ef4444;">
                    <i data-lucide="trash-2" style="width: 0.875rem; height: 0.875rem;"></i>
                    <span>删除节点</span>
                </button>
            </div>
        `;
        
        const propsContainer = document.getElementById('node-properties');
        propsContainer.innerHTML = '';

        const renderProperties = (editing = false) => {
            propsContainer.innerHTML = '';
            const editableProps = ['summary', 'type', 'text'];
            
            let hasEditable = false;
            if (node.properties && Object.keys(node.properties).length > 0) {
                Object.entries(node.properties).forEach(([key, value]) => {
                    const div = document.createElement('div');
                    div.style.cssText = 'margin-bottom: 0.5rem; font-size: 0.75rem; display: flex; flex-direction: column;';
                    
                    if (editing && editableProps.includes(key)) {
                        hasEditable = true;
                        div.innerHTML = `
                            <label style="color: #999; font-size: 0.625rem; margin-bottom: 0.25rem;">${key}</label>
                            <input type="text" data-prop-key="${key}" value="${value}" style="width: 100%; padding: 0.25rem; border: 1px solid #ccc; border-radius: 0.25rem; background: transparent; color: inherit;">
                        `;
                    } else {
                        div.innerHTML = `<span style="color: #999;">${key}:</span> <span>${JSON.stringify(value)}</span>`;
                    }
                    propsContainer.appendChild(div);
                });
            }
            
            if (!hasEditable && editing) {
                propsContainer.innerHTML = '<div style="color: #999; font-size: 0.75rem;">No editable properties for this node type.</div>';
            } else if (!node.properties || Object.keys(node.properties).length === 0) {
                 propsContainer.innerHTML = '<div style="color: #999; font-size: 0.75rem;">No properties</div>';
            }

            if (editing) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.marginTop = '1rem';
                buttonContainer.innerHTML = `
                    <button id="save-props-btn" class="btn btn-primary">Save</button>
                    <button id="cancel-edit-btn" class="btn btn-secondary" style="margin-top: 0.5rem;">Cancel</button>
                `;
                propsContainer.appendChild(buttonContainer);

                document.getElementById('save-props-btn').addEventListener('click', () => saveNodeProperties(node));
                document.getElementById('cancel-edit-btn').addEventListener('click', () => {
                    state.isEditingNode = false;
                    renderNodeInfo();
                });
            }
        };

        renderProperties(state.isEditingNode);

        document.getElementById('edit-node-btn').addEventListener('click', () => {
            state.isEditingNode = !state.isEditingNode;
            renderProperties(state.isEditingNode);
        });
        
        const obsContainer = document.getElementById('node-observations');
        if (node.observations && node.observations.length > 0) {
            node.observations.forEach(obs => {
                const div = document.createElement('div');
                div.style.cssText = 'margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 0.375rem; font-size: 0.75rem;';
                div.textContent = obs;
                obsContainer.appendChild(div);
            });
        } else {
            obsContainer.innerHTML = '<div style="color: #999; font-size: 0.75rem;">No observations</div>';
        }
        
        const neighbors = state.graphData.links.filter(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return sourceId === node.id || targetId === node.id;
        });
        
        const neighborsContainer = document.getElementById('node-neighbors');
        neighborsContainer.innerHTML = '';

        document.getElementById('delete-node-btn').addEventListener('click', async () => {
            if (!state.selectedNode) return;
            
            const confirmed = confirm(`确定要删除节点 "${state.selectedNode.name}" 吗？此操作不可撤销。`);
            if (confirmed) {
                try {
                    const res = await fetch(`/api/node/${state.selectedNode.type}/${state.selectedNode.id}`, {
                        method: 'DELETE',
                        headers: getAuthHeaders()
                    });

                    if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(errData.detail || '删除失败');
                    }
                    
                    showToast('删除成功', '节点已删除', 'success');
                    state.selectedNode = null;
                    renderNodeInfo();
                    el.reloadBtn.click();

                } catch (err) {
                    showToast('删除失败', err.message, 'error');
                }
            }
        });

        if (neighbors.length > 0) {
            neighbors.forEach(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                const otherId = sourceId === node.id ? targetId : sourceId;
                const otherNode = state.graphData.nodes.find(n => n.id === otherId);
                if (otherNode) {
                    const div = document.createElement('div');
                    div.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 0.375rem; transition: background 0.2s; font-size: 0.75rem;';
                    div.addEventListener('mouseenter', () => div.style.background = 'rgba(0,0,0,0.06)');
                    div.addEventListener('mouseleave', () => div.style.background = 'rgba(0,0,0,0.03)');

                    const infoSpan = document.createElement('span');
                    infoSpan.style.cursor = 'pointer';
                    infoSpan.style.flexGrow = '1';
                    infoSpan.innerHTML = `<span style="font-weight: 500;">${otherNode.name}</span> <span style="color: #999; font-size: 0.625rem;">(${(link.relation || link.label)})</span>`;
                    infoSpan.addEventListener('click', () => {
                        state.selectedNode = otherNode;
                        highlightNetwork(otherNode);
                        focusNode(otherNode);
                        renderNodeInfo();
                    });

                    const deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('icon-btn');
                    deleteBtn.style.color = '#ef4444';
                    deleteBtn.style.width = '1.5rem';
                    deleteBtn.style.height = '1.5rem';
                    deleteBtn.title = 'Delete relationship';
                    deleteBtn.innerHTML = `<i data-lucide="x" style="width: 0.875rem; height: 0.875rem;"></i>`;
                    deleteBtn.addEventListener('click', async () => {
                        const confirmed = confirm(`Delete relationship "${(link.relation || link.label)}" between "${node.name}" and "${otherNode.name}"?`);
                        if (confirmed) {
                            const fromNode = state.graphData.nodes.find(n => n.id === sourceId);
                            const toNode = state.graphData.nodes.find(n => n.id === targetId);
                            const params = new URLSearchParams({
                                from_id: sourceId,
                                to_id: targetId,
                                rel_type: (link.relation || link.label),
                                from_type: fromNode.type,
                                to_type: toNode.type
                            });
                            try {
                                const res = await fetch(`/api/edge?${params.toString()}`, {
                                    method: 'DELETE',
                                    headers: getAuthHeaders()
                                });
                                if (!res.ok) {
                                    const errData = await res.json();
                                    throw new Error(errData.detail || 'Failed to delete edge');
                                }
                                showToast('删除成功', '关系已删除', 'success');
                                el.reloadBtn.click();
                            } catch (err) {
                                showToast('删除失败', err.message, 'error');
                            }
                        }
                    });

                    div.appendChild(infoSpan);
                    div.appendChild(deleteBtn);
                    neighborsContainer.appendChild(div);
                }
            });
        } else {
            neighborsContainer.innerHTML = '<div style="color: #999; font-size: 0.75rem;">No connections</div>';
        }
        
        lucide.createIcons();
    }
    
    function performSearch(query) {
        if (!query.trim()) {
            state.highlightNodes.clear();
            state.highlightLinks.clear();
            state.Graph.nodeColor(state.Graph.nodeColor());
            state.Graph.linkColor(state.Graph.linkColor());
            state.Graph.linkDirectionalParticles(0);
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        const matchedNodes = state.graphData.nodes.filter(node =>
            node.name.toLowerCase().includes(lowerQuery) ||
            node.type.toLowerCase().includes(lowerQuery) ||
            node.id.toLowerCase().includes(lowerQuery)
        );
        
        if (matchedNodes.length > 0) {
            state.highlightNodes.clear();
            state.highlightLinks.clear();
            matchedNodes.forEach(node => state.highlightNodes.add(node.id));
            state.Graph.nodeColor(state.Graph.nodeColor());
            state.Graph.linkColor(state.Graph.linkColor());
            
            if (matchedNodes.length === 1) {
                state.selectedNode = matchedNodes[0];
                focusNode(matchedNodes[0]);
                renderNodeInfo();
            }
        }
    }
    
    async function performDebugSearch() {
        const query = el.debugQuery.value.trim();
        if (!query) return;

        const sid = state.currentSessionId;
        if (!sid) {
            showToast('错误', '请先加载会话', 'warning');
            return;
        }
        
        let url = `/api/debug_search?q=${encodeURIComponent(query)}&session_id=${encodeURIComponent(sid)}`;
        
        el.debugLoader.classList.remove('hidden');
        el.debugText.textContent = '';
        el.debugResult.classList.add('hidden');
        
        try {
            const res = await fetch(url, {
                headers: getAuthHeaders()
            });
            
            if (!res.ok) throw new Error('搜索失败: ' + res.statusText);
            const result = await res.json();
            
            state.debugResult = result;
            el.debugStats.textContent = `Nodes: ${result.nodes?.length || 0} | Edges: ${result.edges?.length || 0}`;
            el.debugJson.textContent = JSON.stringify(result, null, 2);
            
            el.debugLoader.classList.add('hidden');
            el.debugText.textContent = '搜索';
            el.debugResult.classList.remove('hidden');
            el.visualizeBtn.disabled = !result.nodes || result.nodes.length === 0;
        } catch (e) {
            el.debugLoader.classList.add('hidden');
            el.debugText.textContent = '搜索';
            el.debugStats.textContent = '错误: ' + e.message;
            el.debugResult.classList.remove('hidden');
            showToast('搜索失败', e.message, 'error');
        }
    }
    
    function visualizeDebugResult() {
        if (!state.debugResult || !state.debugResult.nodes) return;
        
        const debugNodes = state.debugResult.nodes.map(n => ({
            id: n.id || n.name,
            name: n.name || n.id,
            type: n.type || 'debug',
            group: 'debug',
            importance: n.importance || 0.7,
            properties: n.properties || {},
            observations: n.observations || []
        }));
        
        const debugLinks = (state.debugResult.edges || []).map(e => ({
            source: e.source,
            target: e.target,
            relation: e.relation || 'debug_link',
            weight: e.weight || 1
        }));
        
        state.graphData.nodes = debugNodes;
        state.graphData.links = debugLinks;
        state.Graph.graphData(state.graphData);
        updateStats();
        switchTab('info');
    }
    
    el.loginKey.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') login();
    });
    el.loginBtn.addEventListener('click', login);
    el.logoutBtn.addEventListener('click', logout);
    el.themeToggle.addEventListener('click', toggleTheme);
    el.sidebarToggle.addEventListener('click', toggleSidebar);

    el.sessionSelector.addEventListener('change', (e) => {
        const newSessionId = e.target.value;
        loadGraphData(newSessionId);
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    el.searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    el.debugQuery.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performDebugSearch();
    });
    el.debugSearchBtn.addEventListener('click', performDebugSearch);
    el.visualizeBtn.addEventListener('click', visualizeDebugResult);
    
    el.showLabels.addEventListener('change', (e) => {
        state.showLabels = e.target.checked;
        if (state.Graph) state.Graph.nodeCanvasObject(state.Graph.nodeCanvasObject());
    });
    
    el.reloadBtn.addEventListener('click', () => {
        state.selectedNode = null;
        state.highlightNodes.clear();
        state.highlightLinks.clear();
        if (state.currentSessionId) {
            loadGraphData(state.currentSessionId);
        } else {
            console.warn("No current session to reload.");
        }
    });
    
    el.fitViewBtn.addEventListener('click', () => {
        if (state.Graph) state.Graph.zoomToFit(400);
    });

    async function saveNodeProperties(node) {
        const propsContainer = document.getElementById('node-properties');
        const inputs = propsContainer.querySelectorAll('input[data-prop-key]');
        const propertiesToUpdate = {};
        
        inputs.forEach(input => {
            propertiesToUpdate[input.dataset.propKey] = input.value;
        });

        if (Object.keys(propertiesToUpdate).length === 0) {
            showToast('无法更新', '没有要更新的属性', 'warning');
            return;
        }

        try {
            const res = await fetch(`/api/node/${node.type}/${node.id}`, {
                method: 'PATCH',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify(propertiesToUpdate)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || '更新失败');
            }

            showToast('更新成功', '属性已更新', 'success');
            state.isEditingNode = false;
            el.reloadBtn.click();

        } catch (err) {
            showToast('更新失败', err.message, 'error');
        }
    }

    el.toolsBtn.addEventListener('click', showBatchOperationsPanel);
    el.linkEntityBtn.addEventListener('click', showLinkEntityPanel);

    el.connectNodesBtn.addEventListener('click', () => {
        state.isConnecting = !state.isConnecting;
        state.connectionStartNode = null;
        if (state.isConnecting) {
            el.connectNodesBtn.classList.add('active');
            el.connectNodesBtn.innerHTML = `<i data-lucide="x" style="width: 0.875rem; height: 0.875rem;"></i><span>取消连接</span>`;
            showToast('连接模式', '请依次点击两个节点以创建关系', 'info', 3000);
        } else {
            el.connectNodesBtn.classList.remove('active');
            el.connectNodesBtn.innerHTML = `<i data-lucide="share-2" style="width: 0.875rem; height: 0.875rem;"></i><span>连接节点</span>`;
        }
        lucide.createIcons();
    });

    el.rightPanelClose.addEventListener('click', closeRightPanel);

    // WebSocket 和监控功能

    function connectWebSocket() {
        if (state.ws && state.ws.readyState === WebSocket.OPEN) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const url = `${protocol}//${window.location.host}/ws/status`;
        state.ws = new WebSocket(url);

        state.ws.onopen = () => {
            console.log('WebSocket connected');
            addLogEntry({
                level: 'INFO',
                message: '监控服务已连接。',
                timestamp: new Date().toISOString()
            });
        };

        state.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'log':
                        addLogEntry(data.payload);
                        break;
                    case 'task':
                        addTaskEntry(data.payload);
                        break;
                    case 'message':
                        addMessageEntry(data.payload);
                        break;
                }
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        state.ws.onclose = () => {
            console.log('WebSocket disconnected. Retrying in 3 seconds...');
            addLogEntry({
                level: 'WARNING',
                message: '监控服务已断开，3秒后重试...',
                timestamp: new Date().toISOString()
            });
            setTimeout(connectWebSocket, 3000);
        };

        state.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            addLogEntry({
                level: 'ERROR',
                message: '监控服务连接错误。',
                timestamp: new Date().toISOString()
            });
            state.ws.close();
        };
    }

    function addEntry(container, content, isHTML = false) {
        if (state.logPaused) return;
        const wasScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
        
        const entry = document.createElement('div');
        if (isHTML) {
            entry.innerHTML = content;
        } else {
            entry.textContent = content;
        }
        container.appendChild(entry);

        if (wasScrolledToBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function addLogEntry(log) {
        state.logCache.push(log);
        if (shouldDisplayLog(log)) {
            renderLogEntry(log);
        }
    }

    function shouldDisplayLog(log) {
        return state.logLevel === 'ALL' || state.logLevel === log.level;
    }

    function renderLogEntry(log) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.dataset.level = log.level;
        entry.innerHTML = `<span style="color: #999;">${new Date(log.timestamp).toLocaleTimeString()}</span> [${log.level}] ${log.message}`;
        
        el.monitorLogs.appendChild(entry);
        if (!state.logPaused) {
            el.monitorLogs.scrollTop = el.monitorLogs.scrollHeight;
        }
    }

    function rerenderLogs() {
        el.monitorLogs.innerHTML = '';
        state.logCache.forEach(log => {
            if (shouldDisplayLog(log)) {
                renderLogEntry(log);
            }
        });
    }

    function addTaskEntry(task) {
        addEntry(el.monitorTasks, `<span style="color: #999;">${new Date(task.timestamp).toLocaleTimeString()}</span> ${task.content}`, true);
    }

    function addMessageEntry(message) {
        addEntry(el.monitorMessages, `<span style="color: #999;">${new Date(message.timestamp).toLocaleTimeString()}</span> <strong>${message.sender}:</strong> ${message.text}`, true);
    }

    el.logLevelFilter.addEventListener('change', (e) => {
        state.logLevel = e.target.value;
        rerenderLogs();
    });

    el.logPauseToggle.addEventListener('click', () => {
        state.logPaused = !state.logPaused;
        el.logPauseToggle.textContent = state.logPaused ? '继续' : '暂停';
    });

    el.logClear.addEventListener('click', () => {
        el.monitorLogs.innerHTML = '';
        state.logCache = [];
    });
    
    lucide.createIcons();
    
    if (state.isDark) {
        document.body.classList.add('dark');
        el.themeToggle.innerHTML = '<i data-lucide="moon" style="width: 1rem; height: 1rem;"></i>';
        lucide.createIcons();
    }

    checkSession();
})();