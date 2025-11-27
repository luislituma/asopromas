import { type FC, memo } from "react";
import AddToCartButton from "./AddToCartButton";

interface Props {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  variant?: string;
  className?: string;
}

const ButtonBuyComponent: FC<Props> = ({ 
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

// Memoizar para evitar re-renders innecesarios
const ButtonBuy = memo(ButtonBuyComponent);
ButtonBuy.displayName = 'ButtonBuy';

export default ButtonBuy;
