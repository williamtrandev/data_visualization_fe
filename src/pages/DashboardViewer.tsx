
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Download, Share, Filter } from 'lucide-react';

const DashboardViewer = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, we would fetch dashboard data based on id
  const dashboardTitle = 'Sales Performance Dashboard';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dashboardTitle}</h1>
          <p className="text-muted-foreground">Last updated May 2, 2025</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/edit/${id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <Button variant="outline" size="sm" className="sm:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            Viewing data from Jan 1, 2025 - Apr 30, 2025
          </div>
        </div>
        
        {/* Dashboard widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* KPI Cards */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">$528,495</div>
              <p className="text-xs text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12.5% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">2,834</div>
              <p className="text-xs text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                8.2% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">$186.25</div>
              <p className="text-xs text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                2.1% from previous period
              </p>
            </CardContent>
          </Card>
          
          {/* Chart widgets - placeholder */}
          <Card className="md:col-span-2">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64 bg-muted/50 rounded flex items-center justify-center">
                <div className="text-muted-foreground text-sm">
                  Bar chart visualization
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64 bg-muted/50 rounded flex items-center justify-center">
                <div className="text-muted-foreground text-sm">
                  Pie chart visualization
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64 bg-muted/50 rounded flex items-center justify-center">
                <div className="text-muted-foreground text-sm">
                  Data table visualization
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewer;
