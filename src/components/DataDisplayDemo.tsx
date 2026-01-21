import { useState } from 'react';
import { Table, StatusBadge, ProgressBar, Timeline, Button } from './ui';
import type { TableColumn, TimelineItem } from './ui';

// Sample data for demonstration
interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  product: string;
  status: string;
  progress: number;
  price: number;
  dueDate: string;
}

const sampleOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customer: 'Alice Johnson',
    product: 'Diamond Engagement Ring',
    status: 'in_progress',
    progress: 75,
    price: 2500,
    dueDate: '2024-01-15'
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customer: 'Bob Smith',
    product: 'Gold Wedding Band',
    status: 'completed',
    progress: 100,
    price: 800,
    dueDate: '2024-01-10'
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customer: 'Carol Davis',
    product: 'Pearl Necklace',
    status: 'pending',
    progress: 25,
    price: 1200,
    dueDate: '2024-01-20'
  },
  {
    id: 4,
    orderNumber: 'ORD-004',
    customer: 'David Wilson',
    product: 'Sapphire Earrings',
    status: 'shipped',
    progress: 100,
    price: 1800,
    dueDate: '2024-01-12'
  },
  {
    id: 5,
    orderNumber: 'ORD-005',
    customer: 'Eva Brown',
    product: 'Custom Bracelet',
    status: 'cancelled',
    progress: 0,
    price: 950,
    dueDate: '2024-01-25'
  }
];

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    title: 'Order Received',
    description: 'Customer order has been received and validated',
    timestamp: '2024-01-08T09:00:00Z',
    status: 'completed',
    metadata: { department: 'Sales', agent: 'John Doe' }
  },
  {
    id: 2,
    title: 'Design Approved',
    description: 'Customer has approved the initial design concept',
    timestamp: '2024-01-09T14:30:00Z',
    status: 'completed',
    metadata: { designer: 'Jane Smith', revisions: 2 }
  },
  {
    id: 3,
    title: 'Casting in Progress',
    description: 'Metal casting process has begun',
    timestamp: '2024-01-10T08:15:00Z',
    status: 'current',
    metadata: { department: 'Manufacturing', worker: 'Mike Johnson' }
  },
  {
    id: 4,
    title: 'Stone Setting',
    description: 'Gemstones will be set into the piece',
    timestamp: '2024-01-12T10:00:00Z',
    status: 'pending',
    metadata: { department: 'Stone Setting' }
  },
  {
    id: 5,
    title: 'Final Polish',
    description: 'Final polishing and quality check',
    timestamp: '2024-01-14T16:00:00Z',
    status: 'pending',
    metadata: { department: 'Finishing' }
  }
];

export default function DataDisplayDemo() {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const columns: TableColumn<Order>[] = [
    {
      key: 'orderNumber',
      title: 'Order #',
      dataIndex: 'orderNumber',
      sortable: true,
      width: 120,
      responsive: 'always'
    },
    {
      key: 'customer',
      title: 'Customer',
      dataIndex: 'customer',
      sortable: true,
      responsive: 'desktop'
    },
    {
      key: 'product',
      title: 'Product',
      dataIndex: 'product',
      sortable: true,
      responsive: 'tablet'
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => <StatusBadge status={status} />,
      responsive: 'always'
    },
    {
      key: 'progress',
      title: 'Progress',
      dataIndex: 'progress',
      render: (progress: number) => (
        <ProgressBar 
          value={progress} 
          size="sm" 
          color={progress === 100 ? 'success' : progress > 50 ? 'primary' : 'warning'}
        />
      ),
      responsive: 'tablet'
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
      align: 'right',
      sortable: true,
      responsive: 'desktop'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="tertiary">
            Edit
          </Button>
          <Button size="sm" variant="secondary">
            View
          </Button>
        </div>
      ),
      align: 'right',
      responsive: 'desktop'
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = sampleOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Data Display Components Demo</h1>
        <p className="text-gray-600">
          Showcasing enhanced table, status badges, progress bars, and timeline components
        </p>
      </div>

      {/* Enhanced Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Enhanced Table with Pagination</h2>
        <Table
          columns={columns}
          data={paginatedData}
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: (keys) => setSelectedRows(keys)
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: sampleOrders.length,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: [3, 5, 10]
          }}
          onRow={(record) => ({
            onClick: () => console.log('Row clicked:', record),
            className: 'cursor-pointer'
          })}
          hoverable
          responsive
        />
      </section>

      {/* Status Badges */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Status Badges</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Order Statuses</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="pending" />
              <StatusBadge status="in_progress" />
              <StatusBadge status="completed" />
              <StatusBadge status="shipped" />
              <StatusBadge status="delivered" />
              <StatusBadge status="cancelled" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Manufacturing Statuses</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="casting" />
              <StatusBadge status="polishing" />
              <StatusBadge status="stone_setting" />
              <StatusBadge status="finishing" />
              <StatusBadge status="quality_check" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Priority Levels</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="low" variant="outline" />
              <StatusBadge status="medium" variant="dot" />
              <StatusBadge status="high" />
              <StatusBadge status="urgent" />
              <StatusBadge status="critical" />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bars */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Progress Bars</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Manufacturing Progress</h3>
            <div className="space-y-3">
              <ProgressBar 
                value={25} 
                label="Casting" 
                showLabel 
                color="warning"
              />
              <ProgressBar 
                value={60} 
                label="Stone Setting" 
                showLabel 
                color="primary"
              />
              <ProgressBar 
                value={85} 
                label="Polishing" 
                showLabel 
                color="info"
              />
              <ProgressBar 
                value={100} 
                label="Quality Check" 
                showLabel 
                color="success"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Different Variants</h3>
            <div className="space-y-3">
              <ProgressBar value={45} label="Default" showLabel />
              <ProgressBar value={65} label="Striped" showLabel variant="striped" />
              <ProgressBar value={75} label="Animated" showLabel variant="animated" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Different Sizes</h3>
            <div className="space-y-3">
              <ProgressBar value={40} size="sm" label="Small" showLabel />
              <ProgressBar value={60} size="md" label="Medium" showLabel />
              <ProgressBar value={80} size="lg" label="Large" showLabel />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Manufacturing Timeline</h2>
        <div className="max-w-2xl">
          <Timeline items={timelineItems} />
        </div>
      </section>

      {/* Compact Timeline */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Compact Timeline</h2>
        <div className="max-w-2xl">
          <Timeline items={timelineItems.slice(0, 3)} variant="compact" />
        </div>
      </section>
    </div>
  );
}