import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  iconColor: string;
  hoverBorderColor: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  iconColor,
  hoverBorderColor
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`QuickActionCard: Navigating to ${path}`);
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 border-2 border-transparent hover:${hoverBorderColor} group`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-6 text-center">
        <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
        <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
