import React from "react";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
  customIcon?: React.ReactNode;
}

function Dropdown({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  customIcon,
  ...props
}: DropdownProps) {
  return <div>Dropdown</div>;
}

export default Dropdown;
