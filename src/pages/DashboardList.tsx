
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, BarChart, PieChart, LineChart, Table } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for dashboards
const mockDashboards = [
  {
    id: '1',
    title: 'Sales Performance',
    description: 'Monthly sales metrics and performance indicators',
    creator: 'John Doe',
    updatedAt: '2025-04-28',
    tags: ['sales', 'finance'],
    chartCount: 8,
    thumbnail: 'bar'
  },
  {
    id: '2',
    title: 'Marketing Campaign Analysis',
    description: 'Campaign performance metrics and ROI analysis',
    creator: 'Jane Smith',
    updatedAt: '2025-05-01',
    tags: ['marketing', 'social'],
    chartCount: 5,
    thumbnail: 'pie'
  },
  {
    id: '3',
    title: 'Customer Satisfaction',
    description: 'Customer feedback and satisfaction metrics',
    creator: 'Alex Wong',
    updatedAt: '2025-04-25',
    tags: ['customer', 'service'],
    chartCount: 6,
    thumbnail: 'line'
  },
  {
    id: '4',
    title: 'Inventory Management',
    description: 'Stock levels and inventory turnover metrics',
    creator: 'Sarah Johnson',
    updatedAt: '2025-04-30',
    tags: ['inventory', 'operations'],
    chartCount: 4,
    thumbnail: 'table'
  }
];

const getThumbnailIcon = (type: string) => {
  switch (type) {
    case 'bar':
      return <BarChart className="h-20 w-20 text-dashboard-primary opacity-20" />;
    case 'pie':
      return <PieChart className="h-20 w-20 text-dashboard-accent opacity-20" />;
    case 'line':
      return <LineChart className="h-20 w-20 text-dashboard-secondary opacity-20" />;
    case 'table':
      return <Table className="h-20 w-20 text-muted-foreground opacity-20" />;
    default:
      return <BarChart className="h-20 w-20 text-dashboard-primary opacity-20" />;
  }
};

const DashboardList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDashboards = mockDashboards.filter(
    dashboard => dashboard.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboards</h1>
          <p className="text-muted-foreground">Create and manage your data visualizations</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="bg-dashboard-primary hover:bg-dashboard-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Create Dashboard
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search dashboards..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>
      
      {filteredDashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed">
          <div className="bg-muted rounded-full p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No dashboards found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find any dashboards matching your search.
          </p>
          <Button onClick={() => setSearchQuery('')} variant="link" className="mt-4">
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map(dashboard => (
            <Link to={`/dashboard/${dashboard.id}`} key={dashboard.id} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg group-hover:text-dashboard-primary transition-colors">
                    {dashboard.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="relative h-32 bg-muted/50 rounded-md flex items-center justify-center mb-3">
                    {getThumbnailIcon(dashboard.thumbnail)}
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                      {dashboard.chartCount} charts
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {dashboard.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                  <div>Created by {dashboard.creator}</div>
                  <div>Updated {dashboard.updatedAt}</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
          
          <Link to="/dashboard/new" className="block h-full">
            <Card className="border border-dashed h-full flex flex-col items-center justify-center p-6 hover:border-dashboard-primary hover:bg-muted/20 transition-colors">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Plus className="h-6 w-6 text-dashboard-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Create new dashboard</h3>
              <p className="text-sm text-center text-muted-foreground">
                Start building a new visualization dashboard
              </p>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardList;
