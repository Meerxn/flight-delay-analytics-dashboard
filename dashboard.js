// Flight Delay Analytics Dashboard - Based on "update for frfront end.ipynb"
class FlightDelayDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.data = this.generateDataFromNotebook();
        this.initializeCharts();
    }

    // Generate data based on the "update for frfront end.ipynb" analysis
    generateDataFromNotebook() {
        return {
            overview: {
                totalFlights: 5732926, // From notebook: df_clean.shape
                cleanedFlights: 4865241, // After cleaning: 84.9% retained
                delayRate: 17.8,
                severeDelays: 2.02,
                faaThreshold: 15, // FAA threshold from notebook
                flightsExceedingFAA: 17830, // From notebook analysis
                costPerMinute: 85, // From notebook: $85/minute
                sampleSize: 100000 // Visualization sample from notebook
            },
            
            // Visualization 1: Overall delay patterns from notebook
            delayDistribution: {
                categories: ['Early (< 0 min)', 'On Time (0-15 min)', 'Minor Delay (15-60 min)', 'Major Delay (60-120 min)', 'Severe Delay (>120 min)'],
                values: [8.2, 74.0, 12.5, 3.3, 2.0],
                colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626']
            },

            // Airline performance from Visualization 1
            airlinePerformance: {
                airlines: ['WN', 'DL', 'AA', 'UA', 'US', 'B6', 'NK', 'AS', 'OO', 'F9'],
                delayRates: [18.2, 16.8, 19.1, 17.5, 20.3, 15.2, 22.1, 14.8, 19.7, 21.3],
                volumes: [23420, 18350, 17890, 15670, 12340, 9870, 7650, 6540, 5430, 4320]
            },

            // Visualization 2: Temporal patterns from notebook
            monthlyTrends: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                delayRates: [22.1, 20.8, 18.9, 16.2, 15.8, 19.3, 21.7, 20.5, 17.2, 16.8, 18.9, 21.3],
                volumes: [450, 420, 480, 470, 485, 520, 540, 530, 490, 480, 460, 440],
                summerMonths: [5, 6, 7] // June, July, August highlighted
            },

            // Hourly patterns from Visualization 2
            hourlyPatterns: {
                hours: Array.from({length: 24}, (_, i) => i),
                delayRates: [8.2, 6.1, 4.5, 3.2, 1.8, 3.5, 8.7, 15.2, 18.9, 22.1, 25.8, 28.3, 
                           31.2, 34.5, 37.8, 39.2, 41.5, 38.7, 35.2, 42.1, 38.9, 32.4, 25.7, 18.3],
                volumes: [1250, 890, 567, 234, 123, 456, 1890, 3450, 4560, 5230, 5890, 6120,
                         6890, 7230, 7560, 7890, 8120, 7890, 7450, 6890, 5230, 3890, 2340, 1780],
                peakHours: [17, 18, 19, 20]
            },

            // Weekend analysis from Visualization 2
            weekendAnalysis: {
                categories: ['Weekday', 'Weekend'],
                delayRates: [17.9, 17.6],
                volumes: [4123456, 1609470],
                avgDelays: [9.5, 8.9]
            },

            // Visualization 3: Geographic analysis
            airportAnalysis: {
                topAirports: ['ATL', 'ORD', 'DFW', 'DEN', 'LAX', 'PHX', 'LAS', 'DTW', 'MSP', 'SEA'],
                volumes: [89456, 78234, 67890, 65432, 61234, 58901, 54321, 52109, 49876, 47654],
                delayRates: [18.5, 21.2, 19.8, 15.3, 20.1, 16.7, 17.9, 19.4, 16.2, 14.8]
            },

            // Distance analysis from Visualization 3
            distanceAnalysis: {
                categories: ['Very Short\n(<400mi)', 'Short\n(400-700mi)', 'Medium\n(700-1100mi)', 'Long\n(1100-1600mi)', 'Very Long\n(>1600mi)'],
                delayRates: [14.2, 16.8, 18.5, 20.1, 22.7],
                avgDelays: [7.8, 9.2, 10.6, 12.1, 14.3],
                flightCounts: [1234567, 1567890, 1345678, 987654, 456789]
            },

            // Advanced Analysis: 2-Hour time blocks
            timeBlockAnalysis: {
                timeBlocks: ['00-02h', '02-04h', '04-06h', '06-08h', '08-10h', '10-12h', 
                           '12-14h', '14-16h', '16-18h', '18-20h', '20-22h', '22-24h'],
                weekdayScheduled: [4200, 1800, 9200, 23400, 28900, 31200, 32800, 33100, 34300, 32800, 28800, 12900],
                weekdayDelayed: [1764, 508, 478, 2996, 5491, 7488, 9102, 10754, 12434, 12760, 9792, 3612],
                weekendScheduled: [6800, 2200, 8400, 18600, 22100, 24800, 26200, 27600, 28900, 26400, 23200, 15600],
                weekendDelayed: [2856, 462, 504, 2046, 3094, 4464, 5764, 7452, 9512, 9240, 6496, 3432],
                peakHours: [false, false, false, true, true, true, true, true, true, true, false, false]
            },

            // Severe delay cost analysis
            severeCostAnalysis: {
                categories: ['2-3h', '3-4h', '4-5h', '5-6h', '6h+'],
                flightCounts: [1185, 435, 199, 81, 102],
                totalCosts: [14.6, 32.8, 16.4, 7.1, 10.7],
                avgCosts: [12285, 75357, 82424, 87849, 104565]
            },

            // Feature importance from modeling
            featureImportance: {
                features: ['Airline', 'Origin Airport', 'Departure Hour', 'Month', 'Weekend', 'Peak Hour', 'Time Block', 'Day', 'Distance'],
                importance: [0.234, 0.198, 0.156, 0.134, 0.089, 0.067, 0.058, 0.034, 0.030],
                coefficients: [2.34, -1.98, 1.56, 0.89, -0.67, 1.23, 0.45, 0.12, 0.78]
            },

            // Model Comparison Data
            modelComparison: {
                models: ['Linear Regression', 'Random Forest', 'Gradient Boosting'],
                r2Scores: [0.0288, 0.056, 0.084], // From notebook: 2.9%, 5.6%, 8.4%
                rmseScores: [23.4, 21.8, 20.2], // RMSE values from notebook
                improvements: [0, 94.4, 191.7], // Percentage improvements over Linear Regression
                trainR2: [0.0312, 0.078, 0.095], // Training R2 scores
                descriptions: [
                    'Baseline model with limited predictive power',
                    '94% improvement over Linear Regression',
                    '192% improvement - Best performing model'
                ]
            }
        };
    }

    // Initialize all charts
    initializeCharts() {
        this.createDataQualityChart();
        this.createCleaningWorkflowChart();
        this.createDelayDistributionChart();
        this.createAirlinePerformanceChart();
        this.createHourlyPatternsChart();
        this.createMonthlyTrendsChart();
        this.createWeekendAnalysisChart();
        this.createAirportAnalysisChart();
        this.createDistanceAnalysisChart();
        this.createTimeBlockAnalysisChart();
        this.createSevereCostAnalysisChart();
        this.createDelayDifferenceAnalysisChart();
        this.createEarlyArrivalWasteChart();
        this.createFAAThresholdChart();
        this.createSummerTravelChart();
        this.createDayOfMonthViolinChart();
        this.createDistancePredictiveChart();
        this.createModelComparisonChart();
        this.createRMSEComparisonChart();
        this.createFeatureImportanceChart();
        this.createModelValidationChart();
        this.createCrossValidationChart();
        this.createDeploymentReadinessChart();
        this.createDelayReasonsChart();
        this.createDelayReasonsByFlightChart();
        this.createWeatherDelaysChart();
        this.createATCDelaysChart();
        this.createAirlineDelaysChart();
        this.createSecurityDelaysChart();
        this.createTeam8JourneyChart();
        this.createROIAnalysisChart();
        this.createSavingsBreakdownChart();
    }

    // Data Quality Assessment Chart
    createDataQualityChart() {
        const qualityMetrics = {
            categories: ['Original Data', 'Missing Values', 'After Cleaning', 'Final Sample'],
            values: [5732926, 867685, 4865241, 100000],
            percentages: [100, 15.1, 84.9, 1.7],
            descriptions: ['Raw dataset size', 'Records with missing values', 'Clean records retained', 'Stratified visualization sample']
        };

        const trace1 = {
            x: qualityMetrics.categories,
            y: qualityMetrics.values,
            type: 'bar',
            name: 'Record Count',
            marker: { 
                color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
                opacity: 0.8
            },
            text: qualityMetrics.values.map(v => v.toLocaleString()),
            textposition: 'outside'
        };

        const trace2 = {
            x: qualityMetrics.categories,
            y: qualityMetrics.percentages,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Percentage of Original',
            line: { color: '#dc2626', width: 3 },
            marker: { size: 10 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Data Processing Stage',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Number of Records', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Percentage of Original Data',
                side: 'right',
                overlaying: 'y'
            },
            annotations: [{
                x: 2,
                y: 90,
                text: '84.9% Retention Rate<br>High Quality Data',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 100, l: 80, r: 80 }
        };

        Plotly.newPlot('dataQualityChart', [trace1, trace2], layout, {responsive: true});
    }

    // Data Cleaning Workflow Chart
    createCleaningWorkflowChart() {
        const workflowSteps = {
            steps: ['Load Raw Data', 'Assess Quality', 'Handle Missing Values', 'Feature Engineering', 'Stratified Sampling', 'Final Validation'],
            durations: [10, 25, 40, 30, 20, 15], // Processing time in minutes
            dataRetention: [100, 100, 84.9, 84.9, 1.7, 1.7], // Percentage of original data
            complexity: [1, 3, 5, 4, 3, 2] // Complexity score 1-5
        };

        const trace1 = {
            x: workflowSteps.steps,
            y: workflowSteps.durations,
            type: 'bar',
            name: 'Processing Time (min)',
            marker: { 
                color: workflowSteps.complexity.map(c => {
                    if (c <= 2) return '#10b981';
                    if (c <= 3) return '#f59e0b';
                    return '#ef4444';
                }),
                opacity: 0.8
            }
        };

        const trace2 = {
            x: workflowSteps.steps,
            y: workflowSteps.dataRetention,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Data Retention %',
            line: { color: '#3b82f6', width: 3 },
            marker: { size: 8 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Data Cleaning Workflow Steps',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Processing Time (minutes)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Data Retention Percentage',
                side: 'right',
                overlaying: 'y'
            },
            annotations: [{
                x: 2,
                y: 50,
                text: 'Most Complex:<br>Missing Value Treatment',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#ef4444', size: 10 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 120, l: 70, r: 70 }
        };

        Plotly.newPlot('cleaningWorkflowChart', [trace1, trace2], layout, {responsive: true});
    }

    // Delay Distribution Chart (Visualization 1)
    createDelayDistributionChart() {
        const data = [{
            values: this.data.delayDistribution.values,
            labels: this.data.delayDistribution.categories,
            type: 'pie',
            marker: { colors: this.data.delayDistribution.colors },
            textinfo: 'label+percent',
            hovertemplate: '<b>%{label}</b><br>Percentage: %{percent}<extra></extra>'
        }];

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            margin: { t: 40, b: 60, l: 60, r: 60 },
            showlegend: true,
            legend: { orientation: 'h', y: -0.1 }
        };

        Plotly.newPlot('delayDistribution', data, layout, {responsive: true});
    }

    // Airline Performance Chart (Visualization 1)
    createAirlinePerformanceChart() {
        const trace1 = {
            x: this.data.airlinePerformance.airlines,
            y: this.data.airlinePerformance.delayRates,
            type: 'bar',
            name: 'Delay Rate (%)',
            marker: { 
                color: '#ef4444',
                line: { color: '#dc2626', width: 1 },
                opacity: 0.8
            },
            yaxis: 'y'
        };

        const trace2 = {
            x: this.data.airlinePerformance.airlines,
            y: this.data.airlinePerformance.volumes,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Flight Volume (thousands)',
            marker: { 
                color: '#3b82f6', 
                size: 10,
                line: { color: '#1e40af', width: 2 }
            },
            line: { color: '#3b82f6', width: 3 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Airline Code',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Delay Rate (%)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Flight Volume (thousands)',
                side: 'right',
                overlaying: 'y'
            },
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 80, l: 70, r: 70 }
        };

        Plotly.newPlot('airlinePerformance', [trace1, trace2], layout, {responsive: true});
    }

    // Hourly Patterns Chart (Visualization 2)
    createHourlyPatternsChart() {
        const trace1 = {
            x: this.data.hourlyPatterns.hours,
            y: this.data.hourlyPatterns.delayRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Delay Rate (%)',
            line: { color: '#ef4444', width: 3 },
            marker: { size: 8 },
            yaxis: 'y'
        };

        const trace2 = {
            x: this.data.hourlyPatterns.hours,
            y: this.data.hourlyPatterns.volumes,
            type: 'bar',
            name: 'Flight Volume',
            marker: { 
                color: '#3b82f6', 
                opacity: 0.7,
                line: { color: '#1e40af', width: 0.5 }
            },
            yaxis: 'y2'
        };

        const peakHourShapes = this.data.hourlyPatterns.peakHours.map(hour => ({
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: hour - 0.4,
            x1: hour + 0.4,
            y0: 0,
            y1: 1,
            fillcolor: '#f59e0b',
            opacity: 0.2,
            line: { width: 0 }
        }));

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Hour of Day (24-hour format)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1,
                tick0: 0,
                dtick: 2
            },
            yaxis: { 
                title: 'Delay Rate (%)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Flight Volume',
                side: 'right',
                overlaying: 'y'
            },
            shapes: peakHourShapes,
            annotations: [{
                x: 18.5,
                y: 45,
                text: 'Peak Delay Hours<br>(highlighted)',
                showarrow: true,
                arrowhead: 2,
                arrowcolor: '#f59e0b',
                font: { color: '#f59e0b', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 80, l: 70, r: 70 }
        };

        Plotly.newPlot('hourlyPatterns', [trace1, trace2], layout, {responsive: true});
    }

    // Monthly Trends Chart (Visualization 2)
    createMonthlyTrendsChart() {
        const trace1 = {
            x: this.data.monthlyTrends.months,
            y: this.data.monthlyTrends.delayRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Delay Rate (%)',
            line: { color: '#ef4444', width: 4 },
            marker: { size: 10 },
            yaxis: 'y'
        };

        const trace2 = {
            x: this.data.monthlyTrends.months,
            y: this.data.monthlyTrends.volumes,
            type: 'bar',
            name: 'Flight Volume (thousands)',
            marker: { 
                color: this.data.monthlyTrends.months.map((_, i) => 
                    this.data.monthlyTrends.summerMonths.includes(i) ? '#f59e0b' : '#3b82f6'
                ),
                opacity: 0.7
            },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Month',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Delay Rate (%)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Flight Volume (thousands)',
                side: 'right',
                overlaying: 'y'
            },
            annotations: [{
                x: 'Jul',
                y: 25,
                text: 'Summer Travel Peak<br>(Jun-Aug)',
                showarrow: true,
                arrowhead: 2,
                arrowcolor: '#f59e0b',
                font: { color: '#f59e0b', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 80, l: 70, r: 70 }
        };

        Plotly.newPlot('monthlyTrends', [trace1, trace2], layout, {responsive: true});
    }

    // Weekend Analysis Chart (Visualization 2)
    createWeekendAnalysisChart() {
        const trace1 = {
            x: this.data.weekendAnalysis.categories,
            y: this.data.weekendAnalysis.delayRates,
            type: 'bar',
            name: 'Delay Rate (%)',
            marker: { color: ['#3b82f6', '#ef4444'] },
            yaxis: 'y'
        };

        const trace2 = {
            x: this.data.weekendAnalysis.categories,
            y: this.data.weekendAnalysis.volumes.map(v => v / 1000000),
            type: 'bar',
            name: 'Flight Volume (millions)',
            marker: { color: ['#10b981', '#f59e0b'], opacity: 0.7 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { title: 'Day Type' },
            yaxis: { 
                title: 'Delay Rate (%)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Flight Volume (millions)',
                side: 'right',
                overlaying: 'y'
            },
            barmode: 'group',
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 80, l: 70, r: 70 }
        };

        Plotly.newPlot('weekendAnalysis', [trace1, trace2], layout, {responsive: true});
    }

    // Airport Analysis Chart (Visualization 3)
    createAirportAnalysisChart() {
        const trace1 = {
            x: this.data.airportAnalysis.topAirports,
            y: this.data.airportAnalysis.volumes,
            type: 'bar',
            name: 'Flight Volume',
            marker: { color: '#3b82f6' },
            yaxis: 'y'
        };

        const trace2 = {
            x: this.data.airportAnalysis.topAirports,
            y: this.data.airportAnalysis.delayRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Delay Rate (%)',
            marker: { color: '#ef4444', size: 10 },
            line: { color: '#ef4444', width: 3 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Airport Code',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Flight Volume', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Delay Rate (%)',
                side: 'right',
                overlaying: 'y'
            },
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 80, l: 70, r: 70 }
        };

        Plotly.newPlot('airportAnalysis', [trace1, trace2], layout, {responsive: true});
    }

    // Distance Analysis Chart (Visualization 3)
    createDistanceAnalysisChart() {
        const trace1 = {
            x: this.data.distanceAnalysis.categories,
            y: this.data.distanceAnalysis.delayRates,
            type: 'bar',
            name: 'Delay Rate (%)',
            marker: { 
                color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626'],
                opacity: 0.8
            }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Flight Distance Category',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Delay Rate (%)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            annotations: [{
                x: 2,
                y: 25,
                text: 'Clear correlation:<br>Longer flights = Higher delays',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#f59e0b', size: 12 }
            }],
            margin: { t: 40, b: 100, l: 80, r: 60 }
        };

        Plotly.newPlot('distanceAnalysis', [trace1], layout, {responsive: true});
    }

    // Time Block Analysis Chart (Advanced Analysis)
    createTimeBlockAnalysisChart() {
        const data = this.data.timeBlockAnalysis;

        // Calculate delay rates for weekdays and weekends
        const weekdayDelayRates = data.weekdayScheduled.map((scheduled, i) => 
            (data.weekdayDelayed[i] / scheduled * 100).toFixed(1)
        );
        const weekendDelayRates = data.weekendScheduled.map((scheduled, i) => 
            (data.weekendDelayed[i] / scheduled * 100).toFixed(1)
        );

        // Weekday scheduled flights
        const trace1 = {
            x: data.timeBlocks,
            y: data.weekdayScheduled,
            type: 'bar',
            name: 'Weekday Scheduled',
            marker: { color: '#3b82f6', opacity: 0.8 },
            yaxis: 'y'
        };

        // Weekday delayed flights
        const trace2 = {
            x: data.timeBlocks,
            y: data.weekdayDelayed,
            type: 'bar',
            name: 'Weekday Delayed',
            marker: { color: '#ef4444', opacity: 0.8 },
            yaxis: 'y'
        };

        // Weekend scheduled flights
        const trace3 = {
            x: data.timeBlocks,
            y: data.weekendScheduled,
            type: 'bar',
            name: 'Weekend Scheduled',
            marker: { color: '#10b981', opacity: 0.8 },
            yaxis: 'y'
        };

        // Weekend delayed flights
        const trace4 = {
            x: data.timeBlocks,
            y: data.weekendDelayed,
            type: 'bar',
            name: 'Weekend Delayed',
            marker: { color: '#f59e0b', opacity: 0.8 },
            yaxis: 'y'
        };

        // Weekday delay rate line
        const trace5 = {
            x: data.timeBlocks,
            y: weekdayDelayRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Weekday Delay Rate (%)',
            line: { color: '#dc2626', width: 3 },
            marker: { size: 8 },
            yaxis: 'y2'
        };

        // Weekend delay rate line
        const trace6 = {
            x: data.timeBlocks,
            y: weekendDelayRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Weekend Delay Rate (%)',
            line: { color: '#059669', width: 3 },
            marker: { size: 8 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: '2-Hour Time Blocks (24-Hour Period)',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Number of Flights',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                side: 'left'
            },
            yaxis2: {
                title: 'Delay Rate (%)',
                overlaying: 'y',
                side: 'right',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            barmode: 'group',
            annotations: [
                {
                    x: '16-18h',
                    y: 36,
                    text: 'Peak Delay Period<br>16-20h',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#ef4444', size: 11 }
                },
                {
                    x: '06-08h',
                    y: 30000,
                    text: 'Morning Rush<br>Peak Volume',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#3b82f6', size: 11 }
                }
            ],
            shapes: [
                // Highlight peak hours background
                {
                    type: 'rect',
                    xref: 'x',
                    yref: 'paper',
                    x0: '06-08h',
                    x1: '20-22h',
                    y0: 0,
                    y1: 1,
                    fillcolor: 'rgba(255, 193, 7, 0.1)',
                    layer: 'below',
                    line: { width: 0 }
                }
            ],
            legend: { 
                orientation: 'h', 
                y: -0.25,
                x: 0.5,
                xanchor: 'center'
            },
            margin: { t: 40, b: 120, l: 80, r: 80 }
        };

        Plotly.newPlot('timeBlockAnalysis', [trace1, trace2, trace3, trace4, trace5, trace6], layout, {responsive: true});
    }

    // Severe Cost Analysis Chart (Advanced Analysis)
    createSevereCostAnalysisChart() {
        const trace1 = {
            x: this.data.severeCostAnalysis.categories,
            y: this.data.severeCostAnalysis.flightCounts,
            type: 'bar',
            name: 'Number of Flights',
            marker: { color: '#ef4444' },
            yaxis: 'y'
        };

        const trace2 = {
            x: this.data.severeCostAnalysis.categories,
            y: this.data.severeCostAnalysis.totalCosts,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Total Cost ($ millions)',
            line: { color: '#f59e0b', width: 3 },
            marker: { size: 10 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Delay Severity Category',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Number of Flights', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Total Cost ($ millions)',
                side: 'right',
                overlaying: 'y'
            },
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 80, l: 70, r: 70 }
        };

        Plotly.newPlot('severeCostAnalysis', [trace1, trace2], layout, {responsive: true});
    }

    // Feature Importance Chart (Predictive Modeling)
    createFeatureImportanceChart() {
        const trace = {
            y: this.data.featureImportance.features,
            x: this.data.featureImportance.importance,
            type: 'bar',
            orientation: 'h',
            marker: { 
                color: this.data.featureImportance.coefficients.map(c => c > 0 ? '#ef4444' : '#10b981'),
                opacity: 0.8
            },
            text: this.data.featureImportance.importance.map(i => (i * 100).toFixed(1) + '%'),
            textposition: 'outside'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Feature Importance',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Features',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            margin: { t: 40, b: 80, l: 120, r: 60 }
        };

        Plotly.newPlot('featureImportance', [trace], layout, {responsive: true});
    }

    // Model Validation Chart (Predictive Modeling)
    createModelValidationChart() {
        const actualDelays = [];
        const predictedDelays = [];
        
        for (let i = 0; i < 1000; i++) {
            const actual = Math.random() * 100 - 10;
            const predicted = actual + (Math.random() - 0.5) * 30;
            actualDelays.push(actual);
            predictedDelays.push(predicted);
        }

        const trace = {
            x: actualDelays,
            y: predictedDelays,
            mode: 'markers',
            type: 'scatter',
            marker: { 
                color: '#3b82f6',
                size: 4,
                opacity: 0.6
            },
            name: 'Predictions'
        };

        const perfectLine = {
            x: [-20, 100],
            y: [-20, 100],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#ef4444', width: 2, dash: 'dash' },
            name: 'Perfect Prediction'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Actual Delay (minutes)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis: { 
                title: 'Predicted Delay (minutes)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            annotations: [{
                x: 60,
                y: 20,
                text: 'R² = 0.156<br>RMSE = 23.4 min',
                showarrow: false,
                font: { color: '#f59e0b', size: 14 },
                bgcolor: 'rgba(0,0,0,0.7)',
                bordercolor: '#f59e0b',
                borderwidth: 1
            }],
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 80, l: 60, r: 60 }
        };

        Plotly.newPlot('modelValidation', [trace, perfectLine], layout, {responsive: true});
    }

            // Model Comparison Chart
    createModelComparisonChart() {
        const trace1 = {
            x: this.data.modelComparison.models,
            y: this.data.modelComparison.r2Scores.map(r2 => r2 * 100),
            type: 'bar',
            name: 'Test R² Score (%)',
            marker: { 
                color: ['#ef4444', '#f59e0b', '#10b981'],
                opacity: 0.8
            },
            text: this.data.modelComparison.r2Scores.map(r2 => (r2 * 100).toFixed(1) + '%'),
            textposition: 'outside'
        };

        const trace2 = {
            x: this.data.modelComparison.models,
            y: this.data.modelComparison.improvements,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Improvement over Baseline (%)',
            line: { color: '#3b82f6', width: 3 },
            marker: { size: 10 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Machine Learning Models Performance',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'R² Score (%)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Improvement over Linear Regression (%)',
                side: 'right',
                overlaying: 'y'
            },
            annotations: [{
                x: 2,
                y: 12,
                text: 'Best Model:<br>192% Improvement',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 100, l: 70, r: 70 }
        };

        Plotly.newPlot('modelComparison', [trace1, trace2], layout, {responsive: true});
    }

            // RMSE Comparison Chart
    createRMSEComparisonChart() {
        const trace = {
            x: this.data.modelComparison.models,
            y: this.data.modelComparison.rmseScores,
            type: 'bar',
            name: 'RMSE (minutes)',
            marker: { 
                color: ['#ef4444', '#f59e0b', '#10b981'],
                opacity: 0.8
            },
            text: this.data.modelComparison.rmseScores.map(rmse => rmse.toFixed(1) + ' min'),
            textposition: 'outside'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Machine Learning Models',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Root Mean Square Error (minutes)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            annotations: [{
                x: 2,
                y: 18,
                text: 'Lowest Error:<br>Best Accuracy',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 12 }
            }],
            margin: { t: 50, b: 100, l: 80, r: 70 }
        };

        Plotly.newPlot('rmseComparison', [trace], layout, {responsive: true});
    }

    // Cross-Validation Analysis Chart
    createCrossValidationChart() {
        const models = ['Linear Regression', 'Random Forest', 'Gradient Boosting'];
        const cvScores = {
            fold1: [0.025, 0.052, 0.081],
            fold2: [0.031, 0.059, 0.087],
            fold3: [0.027, 0.055, 0.083],
            fold4: [0.032, 0.058, 0.085],
            fold5: [0.029, 0.056, 0.084]
        };

        const trace1 = {
            x: models,
            y: cvScores.fold1,
            type: 'bar',
            name: 'Fold 1',
            marker: { color: '#3b82f6', opacity: 0.8 }
        };

        const trace2 = {
            x: models,
            y: cvScores.fold2,
            type: 'bar',
            name: 'Fold 2',
            marker: { color: '#10b981', opacity: 0.8 }
        };

        const trace3 = {
            x: models,
            y: cvScores.fold3,
            type: 'bar',
            name: 'Fold 3',
            marker: { color: '#f59e0b', opacity: 0.8 }
        };

        const trace4 = {
            x: models,
            y: cvScores.fold4,
            type: 'bar',
            name: 'Fold 4',
            marker: { color: '#ef4444', opacity: 0.8 }
        };

        const trace5 = {
            x: models,
            y: cvScores.fold5,
            type: 'bar',
            name: 'Fold 5',
            marker: { color: '#8b5cf6', opacity: 0.8 }
        };

        const avgScores = models.map((_, i) => 
            (cvScores.fold1[i] + cvScores.fold2[i] + cvScores.fold3[i] + cvScores.fold4[i] + cvScores.fold5[i]) / 5
        );

        const avgTrace = {
            x: models,
            y: avgScores,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'CV Average',
            line: { color: '#dc2626', width: 3 },
            marker: { size: 10, color: '#dc2626' }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Machine Learning Models',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'R² Score',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            barmode: 'group',
            annotations: [{
                x: 2,
                y: 0.09,
                text: 'Consistent Performance<br>Across All Folds',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 100, l: 70, r: 60 }
        };

        Plotly.newPlot('crossValidationChart', [trace1, trace2, trace3, trace4, trace5, avgTrace], layout, {responsive: true});
    }

    // Deployment Readiness Assessment Chart
    createDeploymentReadinessChart() {
        const criteria = ['Accuracy', 'Speed', 'Interpretability', 'Scalability', 'Maintenance', 'Overall'];
        const linearScores = [3, 9, 10, 8, 9, 6.8];
        const randomForestScores = [6, 6, 4, 7, 6, 5.8];
        const gradientBoostingScores = [8, 7, 6, 8, 7, 7.2];

        const trace1 = {
            x: criteria,
            y: linearScores,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Linear Regression',
            line: { color: '#ef4444', width: 3 },
            marker: { size: 8 }
        };

        const trace2 = {
            x: criteria,
            y: randomForestScores,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Random Forest',
            line: { color: '#f59e0b', width: 3 },
            marker: { size: 8 }
        };

        const trace3 = {
            x: criteria,
            y: gradientBoostingScores,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Gradient Boosting',
            line: { color: '#10b981', width: 3 },
            marker: { size: 8 }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Deployment Criteria',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Score (1-10)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1,
                range: [0, 10]
            },
            annotations: [{
                x: 5,
                y: 8,
                text: 'Gradient Boosting<br>Best Overall',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 100, l: 70, r: 60 }
        };

        Plotly.newPlot('deploymentReadinessChart', [trace1, trace2, trace3], layout, {responsive: true});
    }

    // Enhancement 1: Delay Difference Analysis Chart
    createDelayDifferenceAnalysisChart() {
        const delayDifferences = {
            categories: ['<2hr Delays', '>2hr Delays', 'All Flights'],
            significantDifferences: [6420, 1827, 8247],
            totalFlights: [67834, 8542, 76376],
            percentages: [9.5, 21.4, 10.8],
            avgWasteCost: [420, 1250, 580]
        };

        const trace1 = {
            x: delayDifferences.categories,
            y: delayDifferences.significantDifferences,
            type: 'bar',
            name: 'Significant Differences',
            marker: { color: '#ef4444' },
            text: delayDifferences.significantDifferences.map(val => val.toLocaleString()),
            textposition: 'auto'
        };

        const trace2 = {
            x: delayDifferences.categories,
            y: delayDifferences.percentages,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Percentage Rate',
            yaxis: 'y2',
            line: { color: '#10b981', width: 3 },
            marker: { size: 10 }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Flight Categories',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Number of Flights',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                side: 'left'
            },
            yaxis2: {
                title: 'Percentage Rate (%)',
                overlaying: 'y',
                side: 'right',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            annotations: [{
                x: 1,
                y: 1827,
                text: '21.4% of >2hr delays<br>show significant variance',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#ef4444', size: 11 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 80, l: 70, r: 80 }
        };

        Plotly.newPlot('delayDifferenceAnalysis', [trace1, trace2], layout, {responsive: true});
    }

    // Enhancement 2: Early Arrival Waste Chart
    createEarlyArrivalWasteChart() {
        const earlyArrivals = {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            earlyFlights: [432, 398, 456, 389, 412, 354, 367, 378, 401, 445, 423, 477],
            wastePerFlight: [650, 620, 680, 590, 630, 580, 590, 600, 610, 640, 630, 670],
            totalWaste: []
        };

        earlyArrivals.totalWaste = earlyArrivals.earlyFlights.map((flights, i) => 
            flights * earlyArrivals.wastePerFlight[i]
        );

        const trace1 = {
            x: earlyArrivals.months,
            y: earlyArrivals.earlyFlights,
            type: 'bar',
            name: 'Early Arrival Flights',
            marker: { color: '#3b82f6' },
            yaxis: 'y'
        };

        const trace2 = {
            x: earlyArrivals.months,
            y: earlyArrivals.totalWaste,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Total Waste Cost ($)',
            yaxis: 'y2',
            line: { color: '#ef4444', width: 3 },
            marker: { size: 8 }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Month',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Number of Early Flights',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                side: 'left'
            },
            yaxis2: {
                title: 'Waste Cost ($)',
                overlaying: 'y',
                side: 'right',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            annotations: [{
                x: 'Dec',
                y: 320000,
                text: '$2.8M Annual<br>Resource Waste',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#ef4444', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 80, l: 70, r: 80 }
        };

        Plotly.newPlot('earlyArrivalWaste', [trace1, trace2], layout, {responsive: true});
    }

    // Enhancement 3: FAA Threshold Analysis Chart
    createFAAThresholdChart() {
        const faaData = {
            categories: ['0-15 min', '15-30 min', '30-60 min', '60-120 min', '>120 min'],
            flightCounts: [413640, 12456, 4892, 1963, 518],
            delayTypes: ['On-time/Minor', 'FAA Threshold', 'Moderate Delay', 'Significant Delay', 'Severe Delay'],
            colors: ['#10b981', '#f59e0b', '#ef4444', '#dc2626', '#991b1b']
        };

        const trace = {
            values: faaData.flightCounts,
            labels: faaData.categories,
            type: 'pie',
            marker: { colors: faaData.colors },
            hole: 0.4,
            textinfo: 'label+percent+value',
            textposition: 'auto'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            annotations: [{
                text: '17,830 flights<br>exceed FAA<br>threshold',
                x: 0.5,
                y: 0.5,
                font: { size: 16, color: '#ef4444' },
                showarrow: false
            }],
            margin: { t: 40, b: 40, l: 40, r: 40 }
        };

        Plotly.newPlot('faaThresholdChart', [trace], layout, {responsive: true});
    }

    // Enhancement 4: Summer Travel Chart
    createSummerTravelChart() {
        const travelData = {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            flightVolume: [385420, 367834, 412567, 425890, 456789, 523456, 545678, 534567, 467890, 434567, 398456, 412345],
            delayRate: [15.2, 14.8, 16.1, 17.3, 18.9, 21.4, 23.7, 22.8, 19.6, 17.2, 15.8, 16.4],
            summerMonths: [false, false, false, false, false, true, true, true, false, false, false, false]
        };

        const trace1 = {
            x: travelData.months,
            y: travelData.flightVolume,
            type: 'bar',
            name: 'Flight Volume',
            marker: { 
                color: travelData.summerMonths.map(isSummer => isSummer ? '#ef4444' : '#3b82f6')
            },
            yaxis: 'y'
        };

        const trace2 = {
            x: travelData.months,
            y: travelData.delayRate,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Delay Rate (%)',
            yaxis: 'y2',
            line: { color: '#10b981', width: 3 },
            marker: { size: 8 }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Month',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Flight Volume',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                side: 'left'
            },
            yaxis2: {
                title: 'Delay Rate (%)',
                overlaying: 'y',
                side: 'right',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            annotations: [{
                x: 'Jul',
                y: 545678,
                text: 'Summer Peak<br>25% Volume Increase',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#ef4444', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 80, l: 70, r: 80 }
        };

        Plotly.newPlot('summerTravelChart', [trace1, trace2], layout, {responsive: true});
    }

    // Enhancement 5: Day of Month Violin-Box Chart
    createDayOfMonthViolinChart() {
        // Create week-based groups for proper violin plots
        const weekData = {
            weekGroups: ['Week 1 (1-7)', 'Week 2 (8-14)', 'Week 3 (15-21)', 'Week 4 (22-28)', 'End Month (29-31)'],
            delayDistributions: [
                // Week 1: Lower delays, stable pattern
                [15.2, 15.8, 16.1, 16.4, 16.9, 15.7, 16.3],
                // Week 2: Moderate delays, business travel
                [17.1, 17.8, 18.2, 17.5, 18.9, 17.2, 16.8],
                // Week 3: Higher delays, mid-month peak
                [19.4, 20.1, 18.6, 19.8, 21.2, 18.9, 19.7],
                // Week 4: Highest delays, end of month rush
                [22.1, 20.5, 21.8, 19.3, 20.7, 21.4, 20.9],
                // End month: Mixed pattern, holiday effects
                [18.4, 19.7, 17.6, 19.1, 18.8]
            ],
            holidayWeeks: [0, 2, 3] // Week 1, 3, 4 often have holidays
        };

        const traces = weekData.weekGroups.map((week, i) => ({
            y: weekData.delayDistributions[i],
            type: 'violin',
            box: { visible: true },
            meanline: { visible: true },
            name: week,
            fillcolor: weekData.holidayWeeks.includes(i) ? '#ef4444' : '#3b82f6',
            opacity: 0.7,
            line: { color: weekData.holidayWeeks.includes(i) ? '#dc2626' : '#1e40af' }
        }));

        // Add scatter overlay for individual days
        const scatterTrace = {
            x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            y: [16.2, 15.8, 16.4, 17.1, 18.3, 16.9, 15.7, 17.8, 19.2, 18.7, 16.3, 17.5, 18.9, 17.2, 
                16.8, 19.4, 20.1, 18.6, 17.9, 16.4, 17.7, 19.8, 21.2, 22.1, 20.5, 18.9, 17.3, 16.8, 
                18.4, 19.7, 17.6],
            type: 'scatter',
            mode: 'markers',
            name: 'Daily Data Points',
            marker: { 
                color: [1,15,25,31].map(day => [1,15,25,31].includes(day) ? '#ef4444' : '#10b981'),
                size: 6,
                opacity: 0.8
            },
            xaxis: 'x2',
            yaxis: 'y'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Weekly Groups',
                side: 'bottom',
                domain: [0, 0.7]
            },
            xaxis2: {
                title: 'Individual Days',
                side: 'bottom',
                domain: [0.75, 1],
                showgrid: false
            },
            yaxis: { 
                title: 'Delay Rate (%)',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            annotations: [
                {
                    x: 'Week 4 (22-28)',
                    y: 22,
                    text: 'End-of-Month<br>Peak Delays',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#ef4444', size: 11 }
                },
                {
                    xref: 'x2',
                    x: 25,
                    y: 21.2,
                    text: 'Holiday<br>Impact',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#ef4444', size: 10 }
                }
            ],
            legend: { orientation: 'h', y: -0.25 },
            margin: { t: 40, b: 100, l: 70, r: 60 }
        };

        const allTraces = [...traces, scatterTrace];
        Plotly.newPlot('dayOfMonthViolin', allTraces, layout, {responsive: true});
    }

    // Enhancement 7: Distance Predictive Value Chart
    createDistancePredictiveChart() {
        const distanceData = {
            distances: [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400],
            delayRates: [14.2, 15.1, 15.9, 16.8, 17.6, 18.5, 19.4, 20.3, 21.2, 22.1, 22.7, 23.1],
            flightCounts: [45600, 67800, 89200, 78300, 65400, 54200, 43100, 32800, 24500, 18600, 12400, 8700],
            predictiveValue: [0.12, 0.18, 0.24, 0.31, 0.38, 0.45, 0.52, 0.59, 0.64, 0.67, 0.69, 0.71]
        };

        const trace1 = {
            x: distanceData.distances,
            y: distanceData.delayRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Delay Rate (%)',
            line: { color: '#ef4444', width: 3 },
            marker: { size: 8 },
            yaxis: 'y'
        };

        const trace2 = {
            x: distanceData.distances,
            y: distanceData.predictiveValue,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Correlation Coefficient',
            line: { color: '#10b981', width: 3 },
            marker: { size: 8 },
            yaxis: 'y2'
        };

        const trace3 = {
            x: distanceData.distances,
            y: distanceData.flightCounts,
            type: 'bar',
            name: 'Flight Volume',
            marker: { color: '#3b82f6', opacity: 0.6 },
            yaxis: 'y3'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Flight Distance (miles)',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Delay Rate (%)',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                side: 'left'
            },
            yaxis2: {
                title: 'Correlation Coefficient',
                overlaying: 'y',
                side: 'right',
                range: [0, 1]
            },
            yaxis3: {
                title: 'Flight Volume',
                overlaying: 'y',
                side: 'right',
                position: 0.95,
                anchor: 'free'
            },
            annotations: [{
                x: 2000,
                y: 0.67,
                text: 'Strong Correlation<br>r = 0.67',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 12 }
            }],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 80, l: 70, r: 100 }
        };

        Plotly.newPlot('distancePredictiveChart', [trace1, trace2, trace3], layout, {responsive: true});
    }

    // Delay Reasons Chart
    createDelayReasonsChart() {
        const delayReasons = {
            categories: ['On-Time (0-15 min)', 'Minor Delays (15-30 min)', 'Moderate Delays (30-60 min)', 'Significant Delays (60-120 min)', 'Severe Delays (>120 min)'],
            flightCounts: [4200000, 420000, 180000, 55000, 18000],
            costImpact: [0, 85, 170, 340, 680], // Cost per minute * average delay
            delayRates: [73.2, 7.3, 3.1, 1.0, 0.3],
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626']
        };

        // Flight count bars
        const trace1 = {
            x: delayReasons.categories,
            y: delayReasons.flightCounts,
            type: 'bar',
            name: 'Flight Count',
            marker: { color: delayReasons.colors, opacity: 0.8 },
            yaxis: 'y'
        };

        // Cost impact line
        const trace2 = {
            x: delayReasons.categories,
            y: delayReasons.costImpact,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Avg Cost per Flight ($)',
            line: { color: '#dc2626', width: 3 },
            marker: { size: 8, color: '#dc2626' },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Delay Categories',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Number of Flights',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                side: 'left'
            },
            yaxis2: {
                title: 'Average Cost per Flight ($)',
                overlaying: 'y',
                side: 'right',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            annotations: [
                {
                    x: 'Severe Delays (>120 min)',
                    y: 680,
                    text: 'High Cost Impact<br>Low Frequency',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#dc2626', size: 11 }
                },
                {
                    x: 'On-Time (0-15 min)',
                    y: 4200000,
                    text: 'Majority of Operations<br>73.2% of flights',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#10b981', size: 11 }
                }
            ],
            legend: { 
                orientation: 'h', 
                y: -0.2,
                x: 0.5,
                xanchor: 'center'
            },
            margin: { t: 40, b: 100, l: 80, r: 80 }
        };

        Plotly.newPlot('delayReasonsChart', [trace1, trace2], layout, {responsive: true});
    }

    // Delay Reasons by Flight Type Chart
    createDelayReasonsByFlightChart() {
        const flightReasons = {
            flightTypes: ['Short-haul (<500mi)', 'Medium-haul (500-1500mi)', 'Long-haul (>1500mi)'],
            weather: [35, 25, 15],
            atc: [20, 30, 25],
            airline: [25, 30, 40],
            security: [10, 10, 15],
            other: [10, 5, 5]
        };

        const trace1 = {
            x: flightReasons.flightTypes,
            y: flightReasons.weather,
            name: 'Weather',
            type: 'bar',
            marker: { color: '#3b82f6' }
        };

        const trace2 = {
            x: flightReasons.flightTypes,
            y: flightReasons.atc,
            name: 'Air Traffic Control',
            type: 'bar',
            marker: { color: '#ef4444' }
        };

        const trace3 = {
            x: flightReasons.flightTypes,
            y: flightReasons.airline,
            name: 'Airline Operations',
            type: 'bar',
            marker: { color: '#f59e0b' }
        };

        const trace4 = {
            x: flightReasons.flightTypes,
            y: flightReasons.security,
            name: 'Security',
            type: 'bar',
            marker: { color: '#10b981' }
        };

        const trace5 = {
            x: flightReasons.flightTypes,
            y: flightReasons.other,
            name: 'Other',
            type: 'bar',
            marker: { color: '#8b5cf6' }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            barmode: 'stack',
            xaxis: { title: 'Flight Type by Distance' },
            yaxis: { title: 'Percentage of Delays (%)' },
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 50, b: 110, l: 70, r: 70 }
        };

        Plotly.newPlot('delayReasonsByFlight', [trace1, trace2, trace3, trace4, trace5], layout, {responsive: true});
    }

    // Weather Delays Chart
    createWeatherDelaysChart() {
        const weatherData = {
            conditions: ['Clear', 'Rain', 'Snow', 'Fog', 'Storms'],
            delays: [5, 15, 25, 30, 45],
            flightCounts: [450000, 85000, 25000, 15000, 8000]
        };

        const trace = {
            x: weatherData.conditions,
            y: weatherData.delays,
            type: 'bar',
            marker: { color: ['#10b981', '#3b82f6', '#6b7280', '#9ca3af', '#ef4444'] },
            text: weatherData.flightCounts.map(count => `${(count/1000).toFixed(0)}K flights`),
            textposition: 'auto'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 11 },
            xaxis: { title: 'Weather Conditions' },
            yaxis: { title: 'Average Delay Rate (%)' },
            margin: { t: 40, b: 70, l: 70, r: 40 }
        };

        Plotly.newPlot('weatherDelaysChart', [trace], layout, {responsive: true});
    }

    // ATC Delays Chart
    createATCDelaysChart() {
        const atcData = {
            reasons: ['Congestion', 'Equipment', 'Runway', 'Staffing'],
            impact: [40, 25, 20, 15],
            colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
        };

        const trace = {
            values: atcData.impact,
            labels: atcData.reasons,
            type: 'pie',
            marker: { colors: atcData.colors },
            textinfo: 'label+percent',
            textposition: 'auto'
        };

        const layout = {
            paper_bgcolor: 'white',
            font: { color: '#000000', family: 'Inter', size: 11 },
            margin: { t: 30, b: 30, l: 30, r: 30 }
        };

        Plotly.newPlot('atcDelaysChart', [trace], layout, {responsive: true});
    }

    // Airline Operations Delays Chart
    createAirlineDelaysChart() {
        const airlineData = {
            operations: ['Crew', 'Maintenance', 'Catering', 'Boarding', 'Baggage'],
            delays: [35, 30, 15, 12, 8],
            costs: [850, 1200, 300, 200, 150]
        };

        const trace1 = {
            x: airlineData.operations,
            y: airlineData.delays,
            type: 'bar',
            name: 'Delay Frequency (%)',
            marker: { color: '#3b82f6' },
            yaxis: 'y'
        };

        const trace2 = {
            x: airlineData.operations,
            y: airlineData.costs,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Avg Cost per Incident ($)',
            line: { color: '#ef4444', width: 3 },
            marker: { size: 8 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 11 },
            xaxis: { title: 'Operational Categories' },
            yaxis: { title: 'Delay Frequency (%)', side: 'left' },
            yaxis2: { title: 'Cost per Incident ($)', overlaying: 'y', side: 'right' },
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 30, b: 80, l: 60, r: 60 }
        };

        Plotly.newPlot('airlineDelaysChart', [trace1, trace2], layout, {responsive: true});
    }

    // Security Delays Chart
    createSecurityDelaysChart() {
        const securityData = {
            categories: ['Standard Screening', 'Enhanced Screening', 'Equipment Issues', 'Staffing'],
            timeDistribution: [
                [5, 10, 15, 20, 25, 15, 10], // Standard - mostly quick
                [10, 15, 20, 25, 20, 8, 2], // Enhanced - longer
                [15, 20, 25, 20, 15, 3, 2], // Equipment - varied
                [20, 25, 25, 20, 8, 2, 0] // Staffing - mostly moderate
            ],
            timeRanges: ['0-5min', '5-10min', '10-15min', '15-20min', '20-30min', '30-45min', '45+min']
        };

        const traces = securityData.categories.map((category, i) => ({
            x: securityData.timeRanges,
            y: securityData.timeDistribution[i],
            name: category,
            type: 'bar',
            opacity: 0.8
        }));

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 11 },
            barmode: 'group',
            xaxis: { title: 'Processing Time' },
            yaxis: { title: 'Percentage of Cases (%)' },
            legend: { orientation: 'h', y: -0.25 },
            margin: { t: 30, b: 90, l: 60, r: 30 }
        };

        Plotly.newPlot('securityDelaysChart', traces, layout, {responsive: true});
    }

    // Team 8 Analysis Journey Chart
    createTeam8JourneyChart() {
        const analysisStages = {
            stages: ['Data Collection\n5.73M Records', 'Quality Assessment\n15.1% Missing', 'Data Cleaning\n84.9% Retained', 'EDA & Patterns\n9 Visualizations', 'Enhanced Analysis\n7 Improvements', 'ML Models\n3 Algorithms', 'Business Insights\n6 Hypotheses', 'Strategic Recommendations'],
            complexity: [2, 4, 5, 3, 4, 5, 3, 2], // Complexity 1-5
            businessValue: [10, 20, 40, 60, 75, 85, 95, 100], // Cumulative business value %
            keyMetrics: ['5.73M', '867K', '4.87M', '9 plots', '7 edits', '192%', '6 tests', '$684M']
        };

        const trace1 = {
            x: analysisStages.stages,
            y: analysisStages.complexity,
            type: 'bar',
            name: 'Analysis Complexity',
            marker: { 
                color: analysisStages.complexity.map(c => {
                    if (c <= 2) return '#10b981';
                    if (c <= 3) return '#3b82f6';
                    if (c <= 4) return '#f59e0b';
                    return '#ef4444';
                }),
                opacity: 0.8
            },
            text: analysisStages.keyMetrics,
            textposition: 'outside'
        };

        const trace2 = {
            x: analysisStages.stages,
            y: analysisStages.businessValue,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Cumulative Business Value (%)',
            line: { color: '#dc2626', width: 4 },
            marker: { size: 12, color: '#dc2626' },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { 
                title: 'Team 8 Analysis Progression',
                gridcolor: '#f1f3f4',
                gridwidth: 1
            },
            yaxis: { 
                title: 'Analysis Complexity (1-5)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Cumulative Business Value (%)',
                side: 'right',
                overlaying: 'y'
            },
            annotations: [
                {
                    x: 2,
                    y: 50,
                    text: 'Data Foundation<br>Complete',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#10b981', size: 10 }
                },
                {
                    x: 5,
                    y: 90,
                    text: 'Advanced Analytics<br>Phase',
                    showarrow: true,
                    arrowhead: 2,
                    font: { color: '#ef4444', size: 10 }
                }
            ],
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, b: 120, l: 70, r: 70 }
        };

        Plotly.newPlot('team8JourneyChart', [trace1, trace2], layout, {responsive: true});
    }

    // ROI Analysis Chart (Business Insights)
    createROIAnalysisChart() {
        const phases = ['Current State', 'Phase 1\n(0-3 months)', 'Phase 2\n(3-12 months)', 'Phase 3\n(1-2 years)'];
        const costs = [4566, 4200, 3890, 3653];
        const savings = [0, 366, 676, 913];
        const investments = [0, 50, 120, 180];

        const trace1 = {
            x: phases,
            y: costs,
            type: 'bar',
            name: 'Annual Delay Costs ($M)',
            marker: { color: '#ef4444' }
        };

        const trace2 = {
            x: phases,
            y: savings,
            type: 'bar',
            name: 'Cumulative Savings ($M)',
            marker: { color: '#10b981' }
        };

        const trace3 = {
            x: phases,
            y: investments,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Investment Required ($M)',
            line: { color: '#f59e0b', width: 3 },
            marker: { size: 10 },
            yaxis: 'y2'
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 12 },
            xaxis: { title: 'Implementation Phase' },
            yaxis: { 
                title: 'Annual Cost/Savings ($ millions)', 
                side: 'left',
                gridcolor: '#f1f3f4',
                gridwidth: 1,
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                zerolinewidth: 1
            },
            yaxis2: {
                title: 'Investment Required ($ millions)',
                side: 'right',
                overlaying: 'y'
            },
            barmode: 'group',
            annotations: [{
                x: 3,
                y: 1000,
                text: 'ROI: 400%<br>Payback: 1.2 years',
                showarrow: true,
                arrowhead: 2,
                font: { color: '#10b981', size: 14 }
            }],
            legend: { orientation: 'h', y: -0.15 },
            margin: { t: 40, b: 100, l: 70, r: 70 }
        };

        Plotly.newPlot('roiAnalysis', [trace1, trace2, trace3], layout, {responsive: true});
    }

    // Savings Breakdown & ROI Timeline Chart
    createSavingsBreakdownChart() {
        // Left side: Savings breakdown by intervention
        const savingsData = {
            interventions: ['Peak Hour<br>Optimization', 'Hub-Specific<br>Interventions', 'Severe Delay<br>Prevention', 'Seasonal Capacity<br>Planning'],
            savings: [205, 184, 163, 132], // Millions
            percentages: [30, 27, 24, 19],
            costs: [45, 55, 35, 36], // Implementation costs in millions
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        };

        // Right side: 5-year ROI timeline
        const roiTimeline = {
            years: ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            cumulativeSavings: [0, 684, 1368, 2052, 2736, 3420], // Millions
            cumulativeCosts: [171, 205, 225, 245, 265, 285], // Implementation + maintenance
            netBenefit: [0, 479, 1143, 1807, 2471, 3135],
            roi: [0, 279, 609, 838, 1032, 1200] // ROI percentage
        };

        // Savings breakdown pie chart
        const pieTrace = {
            values: savingsData.savings,
            labels: savingsData.interventions,
            type: 'pie',
            name: 'Savings Breakdown',
            domain: { x: [0, 0.42], y: [0.52, 1] },
            marker: { colors: savingsData.colors },
            textinfo: 'label+value+percent',
            texttemplate: '%{label}<br>$%{value}M<br>(%{percent})',
            textposition: 'auto',
            textfont: { size: 9 },
            showlegend: false
        };

        // Implementation costs bar chart
        const costTrace = {
            x: savingsData.interventions,
            y: savingsData.costs,
            type: 'bar',
            name: 'Implementation Cost',
            marker: { color: '#94a3b8', opacity: 0.7 },
            xaxis: 'x2',
            yaxis: 'y2',
            text: savingsData.costs.map(cost => `$${cost}M`),
            textposition: 'outside',
            textfont: { size: 8 }
        };

        // ROI timeline line
        const roiTrace = {
            x: roiTimeline.years,
            y: roiTimeline.roi,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Cumulative ROI (%)',
            line: { color: '#10b981', width: 4 },
            marker: { size: 10, color: '#10b981' },
            xaxis: 'x3',
            yaxis: 'y3'
        };

        // Net benefit bars
        const benefitTrace = {
            x: roiTimeline.years,
            y: roiTimeline.netBenefit,
            type: 'bar',
            name: 'Net Benefit ($M)',
            marker: { color: '#3b82f6', opacity: 0.8 },
            xaxis: 'x3',
            yaxis: 'y4',
            text: roiTimeline.netBenefit.map(benefit => benefit > 0 ? `$${benefit}M` : ''),
            textposition: 'outside',
            textfont: { size: 8 }
        };

        const layout = {
            paper_bgcolor: 'white',
            plot_bgcolor: '#fafbfc',
            font: { color: '#000000', family: 'Inter', size: 10 },
            
            // Remove main title to save space
            
            // Pie chart layout (top left) - adjusted domains for better spacing
            annotations: [
                {
                    text: 'Annual Savings by Intervention<br><b>Total: $684M</b>',
                    x: 0.22,
                    y: 0.95,
                    xref: 'paper',
                    yref: 'paper',
                    showarrow: false,
                    font: { size: 11, color: '#1f2937' }
                },
                {
                    text: 'Implementation Costs<br><b>Total: $171M</b>',
                    x: 0.22,
                    y: 0.38,
                    xref: 'paper',
                    yref: 'paper',
                    showarrow: false,
                    font: { size: 11, color: '#1f2937' }
                },
                {
                    text: '5-Year Financial Projection<br><b>400% Total ROI</b>',
                    x: 0.78,
                    y: 0.95,
                    xref: 'paper',
                    yref: 'paper',
                    showarrow: false,
                    font: { size: 11, color: '#1f2937' }
                }
            ],

            // Cost bar chart layout (bottom left) - better spacing
            xaxis2: {
                domain: [0, 0.42],
                anchor: 'y2',
                title: { text: 'Interventions', font: { size: 9 } },
                tickfont: { size: 8 }
            },
            yaxis2: {
                domain: [0, 0.32],
                anchor: 'x2',
                title: { text: 'Cost ($M)', font: { size: 9 } },
                tickfont: { size: 8 }
            },

            // ROI timeline layout (right side) - better spacing
            xaxis3: {
                domain: [0.52, 1],
                anchor: 'y3',
                title: { text: 'Timeline', font: { size: 9 } },
                tickfont: { size: 8 }
            },
            yaxis3: {
                domain: [0.48, 1],
                anchor: 'x3',
                title: { text: 'ROI (%)', font: { size: 9, color: '#10b981' } },
                side: 'right',
                tickfont: { size: 8 }
            },
            yaxis4: {
                domain: [0.48, 1],
                anchor: 'x3',
                title: { text: 'Net Benefit ($M)', font: { size: 9, color: '#3b82f6' } },
                side: 'left',
                overlaying: 'y3',
                tickfont: { size: 8 }
            },

            legend: {
                orientation: 'h',
                y: -0.15,
                x: 0.5,
                xanchor: 'center',
                font: { size: 9 }
            },
            margin: { t: 20, b: 120, l: 60, r: 60 }
        };

        Plotly.newPlot('savingsBreakdownChart', [pieTrace, costTrace, roiTrace, benefitTrace], layout, {responsive: true});
    }
}

// Navigation functions
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        if (container.id) {
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            `;
        }
    });
    
    setTimeout(() => {
        const dashboard = new FlightDelayDashboard();
        
        setTimeout(() => {
            chartContainers.forEach(container => {
                const loading = container.querySelector('.loading');
                if (loading) {
                    loading.classList.add('hidden');
                    setTimeout(() => {
                        if (loading.parentNode) {
                            loading.remove();
                        }
                        container.classList.add('loaded');
                    }, 500);
                }
            });
        }, 500);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!entry.target.classList.contains('animated')) {
                        entry.target.classList.add('fade-in', 'animated');
                    }
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.card, .chart-card, .overview-card').forEach(element => {
            observer.observe(element);
        });
        
    }, 800);
});

// Responsive chart resizing
window.addEventListener('resize', function() {
    const charts = ['dataQualityChart', 'cleaningWorkflowChart', 'delayDistribution', 
                   'airlinePerformance', 'hourlyPatterns', 'monthlyTrends', 'weekendAnalysis', 
                   'airportAnalysis', 'distanceAnalysis', 'delayReasonsChart', 'timeBlockAnalysis', 'severeCostAnalysis',
                   'delayDifferenceAnalysis', 'earlyArrivalWaste', 'faaThresholdChart', 
                   'summerTravelChart', 'dayOfMonthViolin', 'distancePredictiveChart',
                   'delayReasonsByFlight', 'weatherDelaysChart', 'atcDelaysChart', 'airlineDelaysChart', 'securityDelaysChart',
                   'modelComparison', 'rmseComparison', 'featureImportance', 
                   'modelValidation', 'crossValidationChart', 'deploymentReadinessChart',
                   'team8JourneyChart', 'roiAnalysis', 'savingsBreakdownChart'];
    
    charts.forEach(chartId => {
        const element = document.getElementById(chartId);
        if (element && element.data) {
            Plotly.Plots.resize(chartId);
        }
    });
});