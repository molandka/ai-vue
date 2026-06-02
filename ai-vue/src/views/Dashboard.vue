<template>
    <div class="dashboard-container">
        <div class="stats-section">
            <div class="stats-grid">
                <div v-for="stat in stats" :key="stat.title" class="stat-col">
                    <div class="stat-card" :style="{ background: stat.gradient }">
                        <div class="stat-icon">
                            <el-icon :size="32" :style="{ color: stat.iconColor }">
                                <component :is="stat.icon" />
                            </el-icon>
                        </div>
                        <div class="stat-content">
                            <p class="stat-label">{{ stat.label }}</p>
                            <p class="stat-value">{{ stat.value }}</p>
                            <p class="stat-subtitle">{{ stat.subtitle }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="charts-section">
            <div class="charts-grid">
                <div class="chart-col">
                    <div class="chart-card">
                        <div class="card-header">
                            <h3 class="card-title">情绪趋势分析</h3>
                        </div>
                        <div class="chart-content">
                            <div ref="emotionChartRef" style="height: 320px; width: 100%;"></div>
                        </div>
                    </div>
                </div>
                <div class="chart-col">
                    <div class="chart-card">
                        <div class="card-header">
                            <h3 class="card-title">数据概览</h3>
                        </div>
                        <div class="chart-content">
                            <div class="overview-grid">
                                <div class="overview-item" v-for="item in overviewData" :key="item.label">
                                    <div class="overview-value" :style="{ color: item.color }">{{ item.value }}</div>
                                    <div class="overview-label">{{ item.label }}</div>
                                    <div class="overview-change" :class="item.changeType">
                                        {{ item.change }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getAnalyticsOverview } from '../api/admin'
import { onMounted, ref, computed } from 'vue'
import * as echarts from 'echarts'


const emotionChartRef = ref(null)
let emotionChart = null

const aiData = ref({})

const stats = computed(() => [
    {
        title: 'users',
        label: '总用户数',
        value: aiData.value.systemOverview?.totalUsers || 0,
        subtitle: `活跃用户 ${aiData.value.systemOverview?.activeUsers || 0}`,
        icon: 'Users',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        iconColor: '#ffffff'
    },
    {
        title: 'diaries',
        label: '情绪日志',
        value: aiData.value.systemOverview?.totalDiaries || 0,
        subtitle: `今日新增 ${aiData.value.systemOverview?.totalNewDiaries || 0}`,
        icon: 'User',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        iconColor: '#ffffff'
    },
    {
        title: 'sessions',
        label: '咨询会话',
        value: aiData.value.systemOverview?.totalSessions || 0,
        subtitle: `今日新增 ${aiData.value.systemOverview?.totalNewSessions || 0}`,
        icon: 'MessageSquare',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        iconColor: '#ffffff'
    },
    {
        title: 'mood',
        label: '平均情绪',
        value: aiData.value.systemOverview?.avgMoodScore || 0,
        subtitle: '情绪健康指数',
        icon: 'Mail',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        iconColor: '#ffffff'
    }
])

const overviewData = computed(() => [
    { label: '活跃率', value: '68.5%', change: '+5.2%', color: '#10b981', changeType: 'positive' },
    { label: '留存率', value: '72.3%', change: '+3.1%', color: '#667eea', changeType: 'positive' },
    { label: '满意度', value: '94.1%', change: '-1.2%', color: '#f59e0b', changeType: 'negative' },
    { label: '响应率', value: '98.2%', change: '+0.8%', color: '#8b5cf6', changeType: 'positive' }
])

const initEmotionChart = () => {
    if (!emotionChartRef.value) return
    if (emotionChart) {
        emotionChart.dispose()
    }
    emotionChart = echarts.init(emotionChartRef.value)
    
    const TrendData = aiData.value.emotionTrend || []
    const yellow = '#f59e0b'
    const purple = '#8b5cf6'
    
    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            textStyle: { color: '#334155' },
            padding: [12, 16],
            formatter: (params) => {
                let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`
                params.forEach(item => {
                    result += `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color};"></span>
                        <span>${item.seriesName}: ${item.value}</span>
                    </div>`
                })
                return result
            }
        },
        legend: {
            data: ['平均情绪评分', '记录数量'],
            top: 0,
            textStyle: { color: '#64748b' },
            itemGap: 24
        },
        grid: {
            top: 50,
            bottom: 40,
            left: 50,
            right: 50
        },
        xAxis: {
            type: 'category',
            data: TrendData.map(item => item.date),
            axisLine: { lineStyle: { color: '#e2e8f0' } },
            axisTick: { show: false },
            axisLabel: { color: '#64748b', fontSize: 12 }
        },
        yAxis: [
            {
                type: 'value',
                name: '情绪评分',
                position: 'left',
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: '#f1f5f9' } },
                axisLabel: { color: '#64748b', fontSize: 12 }
            },
            {
                type: 'value',
                name: '记录数量',
                position: 'right',
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { color: '#64748b', fontSize: 12 }
            }
        ],
        series: [
            {
                name: '平均情绪评分',
                type: 'line',
                data: TrendData.map(item => item.avgMoodScore),
                smooth: true,
                lineStyle: { color: yellow, width: 3 },
                itemStyle: { color: yellow },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
                        { offset: 1, color: 'rgba(245, 158, 11, 0.05)' }
                    ])
                },
                symbol: 'circle',
                symbolSize: 6
            },
            {
                name: '记录数量',
                type: 'line',
                yAxisIndex: 1,
                data: TrendData.map(item => item.recordCount),
                smooth: true,
                lineStyle: { color: purple, width: 3 },
                itemStyle: { color: purple },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
                        { offset: 1, color: 'rgba(139, 92, 246, 0.05)' }
                    ])
                },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    }
    
    emotionChart.setOption(option)
}

onMounted(() => {
    getAnalyticsOverview().then(res => {
        aiData.value = res
        setTimeout(() => initEmotionChart(), 100)
    })
})
</script>

<style>
* {
    box-sizing: border-box;
}
.dashboard-container {
    padding: 24px;
}

.stats-section {
    margin-bottom: 24px;
}

.stats-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.stat-col {
    width: calc(25% - 15px);
}

.charts-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.chart-col {
    width: calc(50% - 10px);
}

.stat-card {
    padding: 24px;
    border-radius: 16px;
    color: white;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
    overflow: hidden;
}

.stat-label {
    margin: 0 0 4px 0;
    font-size: 14px;
    opacity: 0.9;
}

.stat-value {
    margin: 0 0 4px 0;
    font-size: 32px;
    font-weight: 700;
}

.stat-subtitle {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
}

.charts-section {
    margin-top: 24px;
}

.chart-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.card-header {
    margin-bottom: 20px;
}

.card-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
}

.chart-content {
    width: 100%;
}

.overview-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    height: 100%;
    overflow: auto;
}

.overview-item {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: transform 0.2s;
}

.overview-item:hover {
    transform: translateY(-2px);
}

.overview-value {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
}

.overview-label {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 8px 0;
}

.overview-change {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-block;
}

.overview-change.positive {
    color: #10b981;
    background: #dcfce7;
}

.overview-change.negative {
    color: #ef4444;
    background: #fee2e2;
}

@media screen and (max-width: 768px) {
    .dashboard-container {
        padding: 12px;
    }

    .stats-section {
        margin-bottom: 16px;
    }

    .stats-grid {
        flex-direction: column;
        gap: 12px;
    }

    .stat-col {
        width: 100%;
    }

    .stat-card {
        padding: 16px;
        flex-direction: column;
        align-items: center;
    }

    .charts-grid {
        flex-direction: column;
        gap: 16px;
    }

    .chart-col {
        width: 100%;
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        margin-right: 12px;
        margin-bottom: 0;
    }

    .stat-label {
        font-size: 12px;
    }

    .stat-value {
        font-size: 22px;
    }

    .stat-subtitle {
        font-size: 10px;
    }

    .charts-section {
        margin-top: 16px;
    }

    .chart-card {
        padding: 16px;
        margin-bottom: 16px;
    }

    .card-title {
        font-size: 15px;
    }

    .overview-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .overview-item {
        padding: 16px;
    }

    .overview-value {
        font-size: 22px;
    }

    .overview-label {
        font-size: 11px;
    }
}

@media screen and (max-width: 375px) {
    .stat-card {
        padding: 12px;
    }

    .stat-icon {
        width: 40px;
        height: 40px;
    }

    .stat-value {
        font-size: 18px;
    }
}
</style>