import { useState } from 'react'
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveStack, 
  TouchTarget,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button
} from './ui'

export function ResponsiveDemo() {
  const [containerSize, setContainerSize] = useState<'mobile' | 'tablet' | 'desktop' | 'wide' | 'full'>('desktop')
  const [gridType, setGridType] = useState<'default' | 'cards'>('cards')
  const [stackSpacing, setStackSpacing] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')

  const sampleCards = [
    { id: 1, title: 'Gold Ring', description: 'Custom 18k gold engagement ring with diamond setting' },
    { id: 2, title: 'Silver Necklace', description: 'Handcrafted sterling silver chain with pendant' },
    { id: 3, title: 'Pearl Earrings', description: 'Elegant freshwater pearl drop earrings' },
    { id: 4, title: 'Platinum Band', description: 'Classic platinum wedding band with brushed finish' },
    { id: 5, title: 'Sapphire Bracelet', description: 'Tennis bracelet with blue sapphires' },
    { id: 6, title: 'Diamond Studs', description: 'Classic diamond stud earrings in white gold' }
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Responsive Layout Components Demo</h1>
        <p className="opacity-70">Showcasing mobile-first responsive containers, grids, stacks, and touch targets</p>
      </div>

      {/* Controls */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Demo Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid type="default" gap="md">
            <div>
              <label className="block text-sm font-medium mb-2">Container Size:</label>
              <select 
                value={containerSize} 
                onChange={(e) => setContainerSize(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
                <option value="desktop">Desktop</option>
                <option value="wide">Wide</option>
                <option value="full">Full Width</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Grid Type:</label>
              <select 
                value={gridType} 
                onChange={(e) => setGridType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="default">Default Grid</option>
                <option value="cards">Card Grid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Stack Spacing:</label>
              <select 
                value={stackSpacing} 
                onChange={(e) => setStackSpacing(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="xs">Extra Small</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* ResponsiveContainer Demo */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>ResponsiveContainer Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            Container adapts its max-width and padding based on the size prop. Current size: <strong>{containerSize}</strong>
          </p>
          
          <div className="border-2 border-dashed border-opacity-30 p-2">
            <ResponsiveContainer size={containerSize} padding="responsive">
              <div className="bg-slate-100 p-4 rounded-lg text-center">
                <h3 className="font-medium mb-2">Responsive Container Content</h3>
                <p className="text-sm opacity-70">
                  This content is inside a ResponsiveContainer with size="{containerSize}" and responsive padding.
                  The container automatically adjusts its max-width and padding for different screen sizes.
                </p>
              </div>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ResponsiveGrid Demo */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>ResponsiveGrid Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            Grid automatically adapts columns based on screen size. Current type: <strong>{gridType}</strong>
          </p>
          
          <ResponsiveGrid type={gridType} gap="md">
            {sampleCards.map((item) => (
              <Card key={item.id} variant="outlined" padding="md" hoverable>
                <CardTitle as="h4">{item.title}</CardTitle>
                <CardContent>
                  <p className="text-sm opacity-75 mt-2">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* ResponsiveStack Demo */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>ResponsiveStack Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            Stack provides consistent vertical spacing that adapts to screen size. Current spacing: <strong>{stackSpacing}</strong>
          </p>
          
          <div className="border-2 border-dashed border-opacity-30 p-4">
            <ResponsiveStack spacing={stackSpacing} align="center">
              <h3 className="font-medium">Stack Item 1</h3>
              <p className="text-sm opacity-70 text-center">This is the first item in the responsive stack</p>
              
              <div className="w-full h-px bg-slate-200"></div>
              
              <h3 className="font-medium">Stack Item 2</h3>
              <p className="text-sm opacity-70 text-center">This is the second item with responsive spacing</p>
              
              <div className="w-full h-px bg-slate-200"></div>
              
              <h3 className="font-medium">Stack Item 3</h3>
              <p className="text-sm opacity-70 text-center">Notice how the spacing adapts to different screen sizes</p>
            </ResponsiveStack>
          </div>
        </CardContent>
      </Card>

      {/* TouchTarget Demo */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>TouchTarget Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            TouchTarget ensures minimum 44px touch targets for mobile accessibility
          </p>
          
          <ResponsiveGrid type="default" gap="md">
            <div>
              <h4 className="font-medium mb-3">Standard Touch Targets</h4>
              <ResponsiveStack spacing="sm" align="start">
                <TouchTarget as="button" onClick={() => alert('Standard touch target clicked!')}>
                  <span className="px-4 py-2 bg-slate-800 text-white rounded-lg">
                    Standard Button
                  </span>
                </TouchTarget>
                
                <TouchTarget as="button" onClick={() => alert('Icon button clicked!')}>
                  <span className="p-2 bg-orange-600 text-white rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                </TouchTarget>
              </ResponsiveStack>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Large Touch Targets</h4>
              <ResponsiveStack spacing="sm" align="start">
                <TouchTarget size="lg" as="button" onClick={() => alert('Large touch target clicked!')}>
                  <span className="px-6 py-3 bg-slate-800 text-white rounded-lg">
                    Large Button
                  </span>
                </TouchTarget>
                
                <TouchTarget size="lg" as="a" href="#demo">
                  <span className="px-6 py-3 bg-orange-600 text-white rounded-lg inline-block">
                    Large Link
                  </span>
                </TouchTarget>
              </ResponsiveStack>
            </div>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Mobile vs Desktop Behavior */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Responsive Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveStack spacing="lg">
            <div>
              <h4 className="font-medium mb-2">Mobile Behavior (&lt; 768px)</h4>
              <ul className="text-sm opacity-70 space-y-1">
                <li>• Single column layouts</li>
                <li>• Larger touch targets (minimum 44px)</li>
                <li>• Increased padding and spacing</li>
                <li>• Stack-based navigation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tablet Behavior (768px - 1024px)</h4>
              <ul className="text-sm opacity-70 space-y-1">
                <li>• Two-column layouts</li>
                <li>• Medium spacing and padding</li>
                <li>• Touch-friendly but more compact</li>
                <li>• Hybrid navigation patterns</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Desktop Behavior (&gt; 1024px)</h4>
              <ul className="text-sm opacity-70 space-y-1">
                <li>• Multi-column layouts (3-4 columns)</li>
                <li>• Compact spacing for efficiency</li>
                <li>• Hover effects and interactions</li>
                <li>• Advanced navigation patterns</li>
              </ul>
            </div>
          </ResponsiveStack>
        </CardContent>
      </Card>

      {/* Integration Example */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Real-World Integration Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            Example of how these components work together in a typical jewelry manufacturing interface
          </p>
          
          <ResponsiveContainer size="wide" padding="responsive">
            <ResponsiveStack spacing="lg">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Order Management Dashboard</h2>
                <p className="opacity-70">Responsive layout adapting to your device</p>
              </div>
              
              <ResponsiveGrid type="cards" gap="lg">
                <Card variant="elevated" padding="md">
                  <CardTitle as="h3">Active Orders</CardTitle>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800 mb-2">24</div>
                    <p className="text-sm opacity-70">Currently in production</p>
                  </CardContent>
                </Card>
                
                <Card variant="elevated" padding="md">
                  <CardTitle as="h3">Completed Today</CardTitle>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                    <p className="text-sm opacity-70">Ready for shipment</p>
                  </CardContent>
                </Card>
                
                <Card variant="elevated" padding="md">
                  <CardTitle as="h3">Pending Approval</CardTitle>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
                    <p className="text-sm opacity-70">Awaiting customer approval</p>
                  </CardContent>
                </Card>
              </ResponsiveGrid>
              
              <ResponsiveStack spacing="md">
                <h3 className="font-medium">Quick Actions</h3>
                <ResponsiveGrid type="default" gap="sm">
                  <TouchTarget as="button" onClick={() => alert('New Order')}>
                    <Button variant="primary" fullWidth>New Order</Button>
                  </TouchTarget>
                  <TouchTarget as="button" onClick={() => alert('View Inventory')}>
                    <Button variant="secondary" fullWidth>View Inventory</Button>
                  </TouchTarget>
                  <TouchTarget as="button" onClick={() => alert('Manufacturing Status')}>
                    <Button variant="tertiary" fullWidth>Manufacturing Status</Button>
                  </TouchTarget>
                </ResponsiveGrid>
              </ResponsiveStack>
            </ResponsiveStack>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}