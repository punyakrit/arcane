import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

type cardProps = React.ComponentProps<typeof Card>;
type CustomCardProps = cardProps & {
  CustomHeader?: React.ReactNode;
  CustomFooter?: React.ReactNode;
  CustomContent?: React.ReactNode;
};

const CustomCard: React.FC<CustomCardProps> = ({
  className,
  CustomHeader,
  CustomFooter,
  CustomContent,
  ...props
}) => {
  return (
    <Card className={`w-[300px] ${className}`} {...props}>
      <CardHeader>{CustomHeader}</CardHeader>
      <CardContent
        className="grid
        gap-4
      "
      >
        {CustomContent}
      </CardContent>
      <CardFooter>{CustomFooter}</CardFooter>
    </Card>
  );
};

export default CustomCard;
