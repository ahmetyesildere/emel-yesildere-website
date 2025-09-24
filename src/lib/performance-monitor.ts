// Performance Monitoring Sistemi

interface PerformanceMetric {
  name: string
  value: number
  timestamp: Date
  category: 'form' | 'network' | 'validation' | 'ui'
}

interface FormPerformanceData {
  formLoadTime: number
  firstInputDelay: number
  validationResponseTime: number
  submitResponseTime: number
  totalInteractionTime: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private formStartTime: number = 0
  private validationStartTime: number = 0
  private submitStartTime: number = 0

  constructor() {
    this.setupPerformanceObserver()
    this.trackPageLoad()
  }

  private setupPerformanceObserver() {
    if (typeof window === 'undefined') return

    // Core Web Vitals tracking
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.addMetric('LCP', lastEntry.startTime, 'ui')
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.addMetric('FID', entry.processingStart - entry.startTime, 'ui')
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            this.addMetric('CLS', entry.value, 'ui')
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  private trackPageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.addMetric('DOM_CONTENT_LOADED', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ui')
      this.addMetric('LOAD_EVENT', navigation.loadEventEnd - navigation.loadEventStart, 'ui')
      this.addMetric('TOTAL_LOAD_TIME', navigation.loadEventEnd - navigation.fetchStart, 'ui')
    })
  }

  private addMetric(name: string, value: number, category: PerformanceMetric['category']) {
    this.metrics.push({
      name,
      value,
      timestamp: new Date(),
      category
    })

    // Development'ta console'a yazdır
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`)
    }
  }

  // Form performance tracking
  startFormTracking() {
    this.formStartTime = performance.now()
    this.addMetric('FORM_START', this.formStartTime, 'form')
  }

  trackFirstInput() {
    if (this.formStartTime > 0) {
      const firstInputTime = performance.now() - this.formStartTime
      this.addMetric('FIRST_INPUT_DELAY', firstInputTime, 'form')
    }
  }

  startValidationTracking() {
    this.validationStartTime = performance.now()
  }

  endValidationTracking() {
    if (this.validationStartTime > 0) {
      const validationTime = performance.now() - this.validationStartTime
      this.addMetric('VALIDATION_TIME', validationTime, 'validation')
      this.validationStartTime = 0
    }
  }

  startSubmitTracking() {
    this.submitStartTime = performance.now()
  }

  endSubmitTracking(success: boolean) {
    if (this.submitStartTime > 0) {
      const submitTime = performance.now() - this.submitStartTime
      this.addMetric(success ? 'SUBMIT_SUCCESS_TIME' : 'SUBMIT_ERROR_TIME', submitTime, 'network')
      this.submitStartTime = 0
    }
  }

  // Network performance tracking
  trackNetworkRequest(url: string, startTime: number, endTime: number, success: boolean) {
    const duration = endTime - startTime
    this.addMetric(`NETWORK_${success ? 'SUCCESS' : 'ERROR'}`, duration, 'network')
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 Network: ${url} took ${duration.toFixed(2)}ms (${success ? 'success' : 'error'})`)
    }
  }

  // Get performance summary
  getPerformanceSummary(): {
    formMetrics: FormPerformanceData
    networkMetrics: { averageResponseTime: number; successRate: number }
    uiMetrics: { lcp?: number; fid?: number; cls?: number }
    recommendations: string[]
  } {
    const formMetrics = this.getFormMetrics()
    const networkMetrics = this.getNetworkMetrics()
    const uiMetrics = this.getUIMetrics()
    const recommendations = this.generateRecommendations(formMetrics, networkMetrics, uiMetrics)

    return {
      formMetrics,
      networkMetrics,
      uiMetrics,
      recommendations
    }
  }

  private getFormMetrics(): FormPerformanceData {
    const getMetricValue = (name: string) => {
      const metric = this.metrics.find(m => m.name === name)
      return metric ? metric.value : 0
    }

    return {
      formLoadTime: getMetricValue('FORM_START'),
      firstInputDelay: getMetricValue('FIRST_INPUT_DELAY'),
      validationResponseTime: getMetricValue('VALIDATION_TIME'),
      submitResponseTime: getMetricValue('SUBMIT_SUCCESS_TIME') || getMetricValue('SUBMIT_ERROR_TIME'),
      totalInteractionTime: getMetricValue('TOTAL_LOAD_TIME')
    }
  }

  private getNetworkMetrics() {
    const networkMetrics = this.metrics.filter(m => m.category === 'network')
    const successMetrics = networkMetrics.filter(m => m.name.includes('SUCCESS'))
    const errorMetrics = networkMetrics.filter(m => m.name.includes('ERROR'))
    
    const averageResponseTime = networkMetrics.length > 0 
      ? networkMetrics.reduce((sum, m) => sum + m.value, 0) / networkMetrics.length 
      : 0

    const successRate = networkMetrics.length > 0 
      ? (successMetrics.length / networkMetrics.length) * 100 
      : 100

    return { averageResponseTime, successRate }
  }

  private getUIMetrics() {
    const getLatestMetric = (name: string) => {
      const metrics = this.metrics.filter(m => m.name === name)
      return metrics.length > 0 ? metrics[metrics.length - 1].value : undefined
    }

    return {
      lcp: getLatestMetric('LCP'),
      fid: getLatestMetric('FID'),
      cls: getLatestMetric('CLS')
    }
  }

  private generateRecommendations(
    formMetrics: FormPerformanceData,
    networkMetrics: { averageResponseTime: number; successRate: number },
    uiMetrics: { lcp?: number; fid?: number; cls?: number }
  ): string[] {
    const recommendations: string[] = []

    // Form performance recommendations
    if (formMetrics.firstInputDelay > 100) {
      recommendations.push('İlk input gecikmesi yüksek. Form yükleme optimizasyonu gerekli.')
    }

    if (formMetrics.validationResponseTime > 300) {
      recommendations.push('Validasyon yanıt süresi yavaş. Debounce süresini artırın.')
    }

    if (formMetrics.submitResponseTime > 3000) {
      recommendations.push('Form gönderimi çok yavaş. Network optimizasyonu gerekli.')
    }

    // Network performance recommendations
    if (networkMetrics.averageResponseTime > 2000) {
      recommendations.push('Ortalama network yanıt süresi yüksek. CDN veya caching ekleyin.')
    }

    if (networkMetrics.successRate < 95) {
      recommendations.push('Network başarı oranı düşük. Retry mekanizması güçlendirilmeli.')
    }

    // UI performance recommendations
    if (uiMetrics.lcp && uiMetrics.lcp > 2500) {
      recommendations.push('LCP yüksek. Critical resources\'ları optimize edin.')
    }

    if (uiMetrics.fid && uiMetrics.fid > 100) {
      recommendations.push('FID yüksek. JavaScript execution time\'ını azaltın.')
    }

    if (uiMetrics.cls && uiMetrics.cls > 0.1) {
      recommendations.push('CLS yüksek. Layout shift\'leri önleyin.')
    }

    if (recommendations.length === 0) {
      recommendations.push('🎉 Performans metrikleri iyi durumda!')
    }

    return recommendations
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: this.getPerformanceSummary(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = []
    this.formStartTime = 0
    this.validationStartTime = 0
    this.submitStartTime = 0
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance tracking
export function usePerformanceTracking() {
  const trackFormStart = () => performanceMonitor.startFormTracking()
  const trackFirstInput = () => performanceMonitor.trackFirstInput()
  const trackValidationStart = () => performanceMonitor.startValidationTracking()
  const trackValidationEnd = () => performanceMonitor.endValidationTracking()
  const trackSubmitStart = () => performanceMonitor.startSubmitTracking()
  const trackSubmitEnd = (success: boolean) => performanceMonitor.endSubmitTracking(success)
  
  return {
    trackFormStart,
    trackFirstInput,
    trackValidationStart,
    trackValidationEnd,
    trackSubmitStart,
    trackSubmitEnd,
    getPerformanceSummary: () => performanceMonitor.getPerformanceSummary(),
    exportMetrics: () => performanceMonitor.exportMetrics()
  }
}

// Development helper
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).performanceMonitor = performanceMonitor
  console.log('🔧 Performance Monitor loaded. Use window.performanceMonitor to access metrics.')
}