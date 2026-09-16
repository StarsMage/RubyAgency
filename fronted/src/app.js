document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(`${tab.dataset.tab}-tab`);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    const formatGB = (val) => {
        if (val === undefined || val === null || isNaN(val)) return '0.00 GB';
        const gb = val > 1024 ? val / (1024**3) : val; 
        return gb.toFixed(2) + ' GB';
    };

    const formatBytesSpeed = (bytes) => {
        if (bytes === undefined || isNaN(bytes)) return '0 B/s';
        if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB/s';
        if (bytes > 1024) return (bytes / 1024).toFixed(2) + ' KB/s';
        return bytes.toFixed(0) + ' B/s';
    };

    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    let cpuChart = null;
    let ramChart = null;
    let coreCharts = {}; // Хранилище графиков ядер
    let networkCharts = {};
    let previousNetStats = {};
    let isNetworkInitialized = false;
    let useCoresGraphics = false; // Состояние чекбокса
    const maxDataPoints = 20;

    // Слушатель чекбокса графиков ядер
    const toggleCoresCheckbox = document.getElementById('toggle-cores-chart');
    if (toggleCoresCheckbox) {
        toggleCoresCheckbox.addEventListener('change', (e) => {
            useCoresGraphics = e.target.checked;
            coreCharts = {}; // Сбрасываем графики при переключении режима для пересоздания
        });
    }

    function initCharts() {
        const ctxCpu = document.getElementById('cpuChart');
        if (ctxCpu) {
            cpuChart = new Chart(ctxCpu, {
                type: 'line',
                data: {
                    labels: Array(maxDataPoints).fill(''),
                    datasets: [{
                        label: 'CPU Usage (%)',
                        data: Array(maxDataPoints).fill(0),
                        borderColor: '#ff0033',
                        backgroundColor: 'rgba(255, 0, 51, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } },
                        x: { grid: { display: false }, ticks: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        const ctxRam = document.getElementById('ramChart');
        if (ctxRam) {
            ramChart = new Chart(ctxRam, {
                type: 'line',
                data: {
                    labels: Array(maxDataPoints).fill(''),
                    datasets: [{
                        label: 'RAM Usage (%)',
                        data: Array(maxDataPoints).fill(0),
                        borderColor: '#ff0033',
                        backgroundColor: 'rgba(255, 0, 51, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } },
                        x: { grid: { display: false }, ticks: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    initCharts();

    async function fetchSystemMetrics() {
        if (!window.go || !window.go.main || !window.go.main.App) return;

        try {
            // 1. CPU
            const cpu = await window.go.main.App.GetCpuInfo();
            const generalEl = document.getElementById('cpu-general');
            if (generalEl) {
                generalEl.innerHTML = `
                    <p style="margin-bottom: 8px; color: #a1a1aa;"><span>Processor:</span> <strong style="color: #fff;">${cpu?.Name ?? 'N/A'}</strong></p>
                    <p style="margin-bottom: 8px; color: #a1a1aa;"><span>Vendor:</span> <strong style="color: #fff;">${cpu?.Vendor ?? 'N/A'}</strong></p>
                    <p style="margin-bottom: 8px; color: #a1a1aa;"><span>Architecture:</span> <strong style="color: #fff;">${cpu?.Architecture ?? 'N/A'}</strong></p>
                    <p style="color: #a1a1aa;"><span>Total Usage:</span> <strong style="color: #ff0033; font-size: 18px;">${cpu?.UsagePercent !== undefined ? Number(cpu.UsagePercent).toFixed(1) + '%' : '0.0%'}</strong></p>
                `;
            }

            // Отрисовка ядер (обычные плашки или мини-графики в зависимости от галочки)
            const coresGrid = document.getElementById('cpu-cores-grid');
            if (cpu && cpu.CoreInfo && coresGrid) {
                if (!useCoresGraphics) {
                    // Режим текста и процентов
                    let coresHtml = '';
                    for (const [coreId, usage] of Object.entries(cpu.CoreInfo)) {
                        coresHtml += `
                            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.04);">
                                <span style="color: #a1a1aa; font-size: 13px;">Core ${coreId}</span> 
                                <strong style="color: #ff0033; font-size: 14px;">${Number(usage).toFixed(1)}%</strong>
                            </div>`;
                    }
                    coresGrid.innerHTML = coresHtml;
                    coreCharts = {}; // сбрасываем объект графиков ядер
                } else {
                    // Режим мини-графиков для каждого ядра
                    if (Object.keys(coreCharts).length === 0) {
                        let canvasHtml = '';
                        for (const coreId of Object.keys(cpu.CoreInfo)) {
                            canvasHtml += `
                                <div style="background: rgba(255,255,255,0.02); padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; gap: 4px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #a1a1aa;">
                                        <span>Core ${coreId}</span>
                                        <strong id="core_val_${coreId}" style="color: #ff0033;">0.0%</strong>
                                    </div>
                                    <div style="position: relative; width: 100%; height: 50px;">
                                        <canvas id="coreChart_${coreId}"></canvas>
                                    </div>
                                </div>`;
                        }
                        coresGrid.innerHTML = canvasHtml;

                        // Инициализируем Chart.js для каждого ядра
                        for (const coreId of Object.keys(cpu.CoreInfo)) {
                            const ctx = document.getElementById(`coreChart_${coreId}`);
                            if (ctx) {
                                coreCharts[coreId] = new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: Array(maxDataPoints).fill(''),
                                        datasets: [{
                                            data: Array(maxDataPoints).fill(0),
                                            borderColor: '#ff0033',
                                            backgroundColor: 'rgba(255, 0, 51, 0.15)',
                                            borderWidth: 1.5,
                                            fill: true,
                                            tension: 0.3,
                                            pointRadius: 0
                                        }]
                                    },
                                    options: {
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        animation: false,
                                        scales: {
                                            y: { beginAtZero: true, max: 100, display: false },
                                            x: { display: false }
                                        },
                                        plugins: { legend: { display: false } }
                                    }
                                });
                            }
                        }
                    }

                    // Обновляем данные графиков ядер на каждом тике
                    for (const [coreId, usage] of Object.entries(cpu.CoreInfo)) {
                        const valEl = document.getElementById(`core_val_${coreId}`);
                        if (valEl) valEl.innerText = Number(usage).toFixed(1) + '%';

                        if (coreCharts[coreId]) {
                            const chart = coreCharts[coreId];
                            chart.data.datasets[0].data.shift();
                            chart.data.datasets[0].data.push(Number(usage));
                            chart.update('none');
                        }
                    }
                }
            }

            if (cpuChart && cpu?.UsagePercent !== undefined) {
                const usage = Number(cpu.UsagePercent);
                cpuChart.data.datasets[0].data.shift();
                cpuChart.data.datasets[0].data.push(usage);
                cpuChart.update('none');
            }

            // 2. RAM
            const ram = await window.go.main.App.GetRamInfo();
            const ramEl = document.getElementById('ram-data');
            if (ramEl) {
                ramEl.innerHTML = `
                    <p style="margin-bottom: 8px;"><span>Total Memory:</span> <strong>${formatGB(ram?.Total)}</strong></p>
                    <p style="margin-bottom: 8px;"><span>Used Memory:</span> <strong style="color: #ff0033;">${formatGB(ram?.Used)}</strong></p>
                    <p style="margin-bottom: 8px;"><span>Free Memory:</span> <strong>${formatGB(ram?.Free)}</strong></p>
                    <p style="margin-bottom: 8px;"><span>Available Memory:</span> <strong>${formatGB(ram?.Available)}</strong></p>
                    <p><span>Usage Percentage:</span> <strong style="color: #ff0033;">${ram?.UsedPercent !== undefined ? Number(ram.UsedPercent).toFixed(1) + '%' : '0.0%'}</strong></p>
                `;
            }

            if (ramChart && ram?.UsedPercent !== undefined) {
                const ramUsage = Number(ram.UsedPercent);
                ramChart.data.datasets[0].data.shift();
                ramChart.data.datasets[0].data.push(ramUsage);
                ramChart.update('none');
            }

            // 3. Disk
            const disks = await window.go.main.App.GetDiskInfo();
            let diskHtml = '';
            if (Array.isArray(disks) && disks.length > 0) {
                diskHtml = '<div class="disk-grid">';
                disks.forEach(d => {
                    const percent = d.UsedPercent !== undefined ? Number(d.UsedPercent).toFixed(1) : 0.0;
                    const degrees = (percent / 100) * 360;

                    diskHtml += `
                        <div class="disk-card">
                            <div class="disk-circle" style="--percentage: ${degrees}deg;">
                                <span class="disk-circle-value">${percent}%</span>
                            </div>
                            <div class="disk-info">
                                <p style="margin-bottom: 6px;"><strong style="color: #ff0033; font-size: 15px;">${d.Path || 'N/A'}</strong> <span style="font-size: 12px; color: #a1a1aa;">(${d.Type || 'Disk'})</span></p>
                                <p><span>Total:</span> <strong>${formatGB(d.Total)}</strong></p>
                                <p><span>Used:</span> <strong style="color: #ff0033;">${formatGB(d.Used)}</strong></p>
                                <p><span>Free:</span> <strong>${formatGB(d.Free)}</strong></p>
                            </div>
                        </div>`;
                });
                diskHtml += '</div>';
            } else {
                diskHtml = '<p>No disk data available</p>';
            }
            const diskEl = document.getElementById('disk-data');
            if (diskEl) diskEl.innerHTML = diskHtml;

            // 4. Network
            const net = await window.go.main.App.GetNetworkInfo();
            const netEl = document.getElementById('netw-data');
            
            if (Array.isArray(net) && net.length > 0) {
                const currentTime = Date.now();

                if (!isNetworkInitialized) {
                    let netHtml = '';
                    net.forEach(n => {
                        const name = n.Name || 'Interface';
                        const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');
                        
                        netHtml += `
                            <div class="metric-card" style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <strong style="color: #ff0033; font-size: 16px;"> ${name}</strong>
                                    <span style="font-size: 12px; color: #a1a1aa;">Active</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a1a1aa;">
                                    <span>↓ Recv: <strong id="net_recv_${safeId}" style="color: #fff;">0 B/s</strong></span>
                                    <span>↑ Sent: <strong id="net_sent_${safeId}" style="color: #fff;">0 B/s</strong></span>
                                </div>
                                <div style="position: relative; width: 100%; height: 140px;">
                                    <canvas id="netChart_${safeId}"></canvas>
                                </div>
                            </div>`;
                    });
                    if (netEl) netEl.innerHTML = netHtml;
                    isNetworkInitialized = true;

                    net.forEach(n => {
                        const name = n.Name || 'Interface';
                        const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');
                        const ctx = document.getElementById(`netChart_${safeId}`);
                        if (ctx) {
                            networkCharts[name] = new Chart(ctx, {
                                type: 'line',
                                data: {
                                    labels: Array(maxDataPoints).fill(''),
                                    datasets: [{
                                        label: 'Receive Speed',
                                        data: Array(maxDataPoints).fill(0),
                                        borderColor: '#ff0033',
                                        backgroundColor: 'rgba(255, 0, 51, 0.1)',
                                        borderWidth: 2,
                                        fill: true,
                                        tension: 0.3,
                                        pointRadius: 0
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: false,
                                    scales: {
                                        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa', font: { size: 10 } } },
                                        x: { grid: { display: false }, ticks: { display: false } }
                                    },
                                    plugins: { legend: { display: false } }
                                }
                            });
                        }
                    });
                }

                net.forEach(n => {
                    const name = n.Name || 'Interface';
                    const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');
                    
                    const currentSent = n.BytesSent || 0;
                    const currentRecv = n.BytesRecv || 0;

                    let sentSpeed = 0;
                    let recvSpeed = 0;

                    if (previousNetStats[name]) {
                        const timeDiff = (currentTime - previousNetStats[name].time) / 1000;
                        if (timeDiff > 0) {
                            sentSpeed = Math.max(0, (currentSent - previousNetStats[name].sent) / timeDiff);
                            recvSpeed = Math.max(0, (currentRecv - previousNetStats[name].recv) / timeDiff);
                        }
                    }

                    previousNetStats[name] = {
                        sent: currentSent,
                        recv: currentRecv,
                        time: currentTime
                    };

                    const recvEl = document.getElementById(`net_recv_${safeId}`);
                    const sentEl = document.getElementById(`net_sent_${safeId}`);
                    if (recvEl) recvEl.innerText = formatBytesSpeed(recvSpeed);
                    if (sentEl) sentEl.innerText = formatBytesSpeed(sentSpeed);

                    if (networkCharts[name]) {
                        const chart = networkCharts[name];
                        chart.data.datasets[0].data.shift();
                        chart.data.datasets[0].data.push(recvSpeed);
                        chart.update('none');
                    }
                });

            } else {
                if (netEl) netEl.innerHTML = '<p>No network interfaces found</p>';
            }

        } catch (err) {
            console.error("Metric fetch error:", err);
        }
    }

    fetchSystemMetrics();
    setInterval(fetchSystemMetrics, 2000);

    // --- УПРАВЛЕНИЕ ОКНОМ WAILS ---
    const minBtn = document.getElementById('min-btn');
    const maxBtn = document.getElementById('max-btn');
    const closeBtn = document.getElementById('close-btn');

    if (minBtn) {
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.runtime && window.runtime.WindowMinimise) {
                window.runtime.WindowMinimise();
            }
        });
    }

    if (maxBtn) {
        maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.runtime && window.runtime.WindowToggleMaximise) {
                window.runtime.WindowToggleMaximise();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.runtime && window.runtime.Quit) {
                window.runtime.Quit();
            }
        });
    }
});