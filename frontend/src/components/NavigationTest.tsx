import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const NavigationTest: React.FC = () => {
  const navigate = useNavigate();

  const testNavigation = (path: string, name: string) => {
    console.log(`Testing navigation to: ${path}`);
    toast.info(`Attempting to navigate to ${name}...`);
    
    try {
      navigate(path);
      toast.success(`Successfully navigated to ${name}!`);
      console.log(`Navigation to ${path} successful`);
    } catch (error) {
      console.error(`Navigation error:`, error);
      toast.error(`Failed to navigate to ${name}`);
    }
  };

  return (
    <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
      <h2 className="text-lg font-bold text-yellow-800 mb-4">🧪 Navigation Test Component</h2>
      <p className="text-sm text-yellow-700 mb-4">
        Click these buttons to test if navigation is working properly:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => testNavigation('/products', 'Products')}>
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <Button variant="outline" className="w-full">
              Test Products Navigation
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => testNavigation('/issuance', 'Issuance')}>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <Button variant="outline" className="w-full">
              Test Issuance Navigation
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => testNavigation('/reports', 'Reports')}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <Button variant="outline" className="w-full">
              Test Reports Navigation
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-100 rounded text-sm text-yellow-800">
        <strong>Debug Info:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Check browser console for navigation logs</li>
          <li>Look for toast notifications indicating success/failure</li>
          <li>URL should change when navigation works</li>
          <li>If navigation fails, check for JavaScript errors</li>
        </ul>
      </div>
    </div>
  );
};
