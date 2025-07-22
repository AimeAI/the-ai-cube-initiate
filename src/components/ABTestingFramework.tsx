import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAnalytics } from './AdvancedAnalytics';

interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABVariant[];
  trafficAllocation: number; // Percentage of users to include
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  targetMetric: string;
  minimumSampleSize: number;
  confidenceLevel: number;
  currentSampleSize: number;
  results?: ABTestResults;
}

interface ABVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // Traffic split percentage
  config: Record<string, any>;
  metrics: {
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
  };
}

interface ABTestResults {
  winner?: string;
  confidence: number;
  significantDifference: boolean;
  liftPercentage: number;
  pValue: number;
}

interface ABTestContext {
  activeTests: ABTest[];
  getVariant: (testId: string) => ABVariant | null;
  trackConversion: (testId: string, value?: number) => void;
  isUserInTest: (testId: string) => boolean;
  getUserVariant: (testId: string) => string | null;
}

// Predefined A/B tests
const predefinedTests: ABTest[] = [
  {
    id: 'hero_cta_test',
    name: 'Hero CTA Button Test',
    description: 'Test different CTA button styles and text',
    variants: [
      {
        id: 'control',
        name: 'Control - Gradient Button',
        description: 'Original gradient button with "Try 3 Games FREE"',
        weight: 50,
        config: {
          buttonStyle: 'gradient',
          buttonText: 'Try 3 Games FREE',
          buttonSize: 'lg'
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      },
      {
        id: 'variant_a',
        name: 'Variant A - Solid Button',
        description: 'Solid button with "Start Learning Now"',
        weight: 50,
        config: {
          buttonStyle: 'solid',
          buttonText: 'Start Learning Now',
          buttonSize: 'xl'
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      }
    ],
    trafficAllocation: 100,
    status: 'running',
    startDate: new Date(),
    targetMetric: 'click_through_rate',
    minimumSampleSize: 1000,
    confidenceLevel: 95,
    currentSampleSize: 0
  },
  {
    id: 'pricing_display_test',
    name: 'Pricing Display Test',
    description: 'Test monthly vs yearly pricing prominence',
    variants: [
      {
        id: 'monthly_first',
        name: 'Monthly First',
        description: 'Show monthly pricing first',
        weight: 50,
        config: {
          defaultBilling: 'monthly',
          highlightYearly: false
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      },
      {
        id: 'yearly_first',
        name: 'Yearly First',
        description: 'Show yearly pricing first with savings highlight',
        weight: 50,
        config: {
          defaultBilling: 'yearly',
          highlightYearly: true,
          savingsCallout: true
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      }
    ],
    trafficAllocation: 80,
    status: 'running',
    startDate: new Date(),
    targetMetric: 'conversion_rate',
    minimumSampleSize: 500,
    confidenceLevel: 95,
    currentSampleSize: 0
  },
  {
    id: 'testimonial_layout_test',
    name: 'Testimonial Layout Test',
    description: 'Test carousel vs grid layout for testimonials',
    variants: [
      {
        id: 'carousel',
        name: 'Carousel Layout',
        description: 'Single testimonial with navigation',
        weight: 50,
        config: {
          layout: 'carousel',
          autoRotate: true,
          showNavigation: true
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Multiple testimonials in grid',
        weight: 50,
        config: {
          layout: 'grid',
          columns: 3,
          showAll: true
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      }
    ],
    trafficAllocation: 60,
    status: 'running',
    startDate: new Date(),
    targetMetric: 'engagement_rate',
    minimumSampleSize: 800,
    confidenceLevel: 95,
    currentSampleSize: 0
  },
  {
    id: 'urgency_messaging_test',
    name: 'Urgency Messaging Test',
    description: 'Test different urgency messages',
    variants: [
      {
        id: 'social_proof',
        name: 'Social Proof Urgency',
        description: 'Join 2,847+ families message',
        weight: 33,
        config: {
          urgencyType: 'social_proof',
          message: 'Join 2,847+ families already giving their kids the AI advantage'
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      },
      {
        id: 'scarcity',
        name: 'Scarcity Urgency',
        description: 'Limited time offer message',
        weight: 33,
        config: {
          urgencyType: 'scarcity',
          message: 'Limited time: Start your AI journey today'
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      },
      {
        id: 'fomo',
        name: 'FOMO Urgency',
        description: 'Don\'t fall behind message',
        weight: 34,
        config: {
          urgencyType: 'fomo',
          message: 'Don\'t let your child fall behind in the AI revolution'
        },
        metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
      }
    ],
    trafficAllocation: 70,
    status: 'running',
    startDate: new Date(),
    targetMetric: 'conversion_rate',
    minimumSampleSize: 600,
    confidenceLevel: 95,
    currentSampleSize: 0
  }
];

const ABTestingContext = createContext<ABTestContext | null>(null);

const ABTestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const analytics = useAnalytics();
  const [activeTests, setActiveTests] = useState<ABTest[]>(predefinedTests);
  const [userAssignments, setUserAssignments] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ab_test_assignments');
    return saved ? JSON.parse(saved) : {};
  });

  // Assign user to test variants
  const assignUserToTests = () => {
    const newAssignments: Record<string, string> = { ...userAssignments };
    
    activeTests.forEach(test => {
      if (test.status !== 'running') return;
      if (userAssignments[test.id]) return; // Already assigned
      
      // Check if user should be included in test
      if (Math.random() * 100 > test.trafficAllocation) return;
      
      // Assign to variant based on weights
      const random = Math.random() * 100;
      let cumulativeWeight = 0;
      
      for (const variant of test.variants) {
        cumulativeWeight += variant.weight;
        if (random <= cumulativeWeight) {
          newAssignments[test.id] = variant.id;
          
          // Track assignment
          analytics.trackEvent({
            event: 'ab_test_assignment',
            category: 'Experiment',
            action: 'assign',
            label: `${test.name}:${variant.name}`,
            customParameters: {
              test_id: test.id,
              variant_id: variant.id,
              test_name: test.name,
              variant_name: variant.name
            }
          });
          
          break;
        }
      }
    });
    
    if (Object.keys(newAssignments).length !== Object.keys(userAssignments).length) {
      setUserAssignments(newAssignments);
      localStorage.setItem('ab_test_assignments', JSON.stringify(newAssignments));
    }
  };

  // Get variant for a test
  const getVariant = (testId: string): ABVariant | null => {
    const test = activeTests.find(t => t.id === testId);
    if (!test || !userAssignments[testId]) return null;
    
    const variant = test.variants.find(v => v.id === userAssignments[testId]);
    
    // Track impression
    if (variant) {
      updateVariantMetrics(testId, userAssignments[testId], 'impression');
    }
    
    return variant || null;
  };

  // Track conversion
  const trackConversion = (testId: string, value?: number) => {
    const variantId = userAssignments[testId];
    if (!variantId) return;
    
    updateVariantMetrics(testId, variantId, 'conversion', value);
    
    analytics.trackEvent({
      event: 'ab_test_conversion',
      category: 'Experiment',
      action: 'convert',
      label: `${testId}:${variantId}`,
      value,
      customParameters: {
        test_id: testId,
        variant_id: variantId,
        conversion_value: value
      }
    });
  };

  // Update variant metrics
  const updateVariantMetrics = (testId: string, variantId: string, type: 'impression' | 'conversion', value?: number) => {
    setActiveTests(prevTests => 
      prevTests.map(test => {
        if (test.id !== testId) return test;
        
        return {
          ...test,
          variants: test.variants.map(variant => {
            if (variant.id !== variantId) return variant;
            
            const updatedMetrics = { ...variant.metrics };
            
            if (type === 'impression') {
              updatedMetrics.impressions += 1;
            } else if (type === 'conversion') {
              updatedMetrics.conversions += 1;
              if (value) {
                updatedMetrics.revenue = (updatedMetrics.revenue || 0) + value;
              }
            }
            
            updatedMetrics.conversionRate = updatedMetrics.impressions > 0 
              ? (updatedMetrics.conversions / updatedMetrics.impressions) * 100 
              : 0;
            
            return { ...variant, metrics: updatedMetrics };
          }),
          currentSampleSize: test.currentSampleSize + 1
        };
      })
    );
  };

  // Check if user is in test
  const isUserInTest = (testId: string): boolean => {
    return !!userAssignments[testId];
  };

  // Get user's variant for a test
  const getUserVariant = (testId: string): string | null => {
    return userAssignments[testId] || null;
  };

  // Statistical significance calculation
  const calculateSignificance = (test: ABTest): ABTestResults | null => {
    if (test.variants.length !== 2) return null; // Only for A/B tests
    
    const [control, variant] = test.variants;
    
    if (control.metrics.impressions < 100 || variant.metrics.impressions < 100) {
      return null; // Not enough data
    }
    
    // Z-test for proportions
    const p1 = control.metrics.conversions / control.metrics.impressions;
    const p2 = variant.metrics.conversions / variant.metrics.impressions;
    const n1 = control.metrics.impressions;
    const n2 = variant.metrics.impressions;
    
    const pooledP = (control.metrics.conversions + variant.metrics.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    const zScore = (p2 - p1) / se;
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
    
    const significantDifference = pValue < (1 - test.confidenceLevel / 100);
    const liftPercentage = ((p2 - p1) / p1) * 100;
    const winner = significantDifference ? (p2 > p1 ? variant.id : control.id) : undefined;
    
    return {
      winner,
      confidence: (1 - pValue) * 100,
      significantDifference,
      liftPercentage,
      pValue
    };
  };

  // Normal CDF approximation
  const normalCDF = (x: number): number => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  // Error function approximation
  const erf = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  };

  // Initialize user assignments on mount
  useEffect(() => {
    assignUserToTests();
  }, []);

  // Update test results periodically
  useEffect(() => {
    const updateResults = () => {
      setActiveTests(prevTests => 
        prevTests.map(test => ({
          ...test,
          results: calculateSignificance(test)
        }))
      );
    };

    const interval = setInterval(updateResults, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Auto-complete tests when significant
  useEffect(() => {
    activeTests.forEach(test => {
      if (test.status === 'running' && test.results?.significantDifference && 
          test.currentSampleSize >= test.minimumSampleSize) {
        
        analytics.trackEvent({
          event: 'ab_test_completed',
          category: 'Experiment',
          action: 'complete',
          label: test.name,
          customParameters: {
            test_id: test.id,
            winner: test.results.winner,
            confidence: test.results.confidence,
            lift: test.results.liftPercentage,
            sample_size: test.currentSampleSize
          }
        });
      }
    });
  }, [activeTests]);

  const contextValue: ABTestContext = {
    activeTests,
    getVariant,
    trackConversion,
    isUserInTest,
    getUserVariant
  };

  return (
    <ABTestingContext.Provider value={contextValue}>
      {children}
    </ABTestingContext.Provider>
  );
};

// Hook for using A/B testing
export const useABTesting = (): ABTestContext => {
  const context = useContext(ABTestingContext);
  if (!context) {
    throw new Error('useABTesting must be used within ABTestingProvider');
  }
  return context;
};

// Component for A/B test variants
export const ABTestVariant: React.FC<{
  testId: string;
  children: (variant: ABVariant | null) => ReactNode;
}> = ({ testId, children }) => {
  const { getVariant } = useABTesting();
  const variant = getVariant(testId);
  
  return <>{children(variant)}</>;
};

// Higher-order component for A/B testing
export const withABTesting = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const abTesting = useABTesting();
    return <Component {...props} abTesting={abTesting} />;
  };
};

export default ABTestingProvider;
