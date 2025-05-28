import React from "react";

interface Props {
  mockComponent?: string;
}

const SimpleComponent: React.FC<Props> = ({ mockComponent }: Props) => {
  return <div>{mockComponent}</div>;
};

export default SimpleComponent;
