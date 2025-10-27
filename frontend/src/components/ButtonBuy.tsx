import { type FC } from "react";
import AddToCartButton from "./AddToCartButton";

interface Props {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  variant?: string;
  className?: string;
}

const ButtonBuy: FC<Props> = ({ 
  productId, 
  productName,
  productPrice,
  productImage,
  variant,
  className
}) => {
  return (
    <AddToCartButton
      productId={productId}
      productName={productName}
      productPrice={productPrice}
      productImage={productImage}
      variant={variant}
      className={className}
    />
  );
};

export default ButtonBuy;
