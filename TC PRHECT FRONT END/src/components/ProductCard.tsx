import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      setQuantity(1);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imagen ? (
          <img src={product.imagen} alt={product.nombre} />
        ) : (
          <div className="product-image-placeholder">
            <span>Sin imagen</span>
          </div>
        )}
        {!product.disponible && <div className="product-badge unavailable">No disponible</div>}
        {product.stock <= product.stockMinimo && product.disponible && (
          <div className="product-badge low-stock">Stock bajo</div>
        )}
      </div>

      <div className="product-info">
        <h3>{product.nombre}</h3>
        <p className="product-category">{product.categoria}</p>
        <p className="product-description">{product.descripcion}</p>
        
        <div className="product-footer">
          <div className="product-price">Bs. {product.precio.toFixed(2)}</div>
          <div className="product-stock">Stock: {product.stock}</div>
        </div>

        {product.disponible && product.stock > 0 && (
          <div className="product-actions">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <button
              className={`btn ${added ? 'btn-success' : 'btn-primary'}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? (
                <>
                  <Check size={18} /> Agregado
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Agregar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
