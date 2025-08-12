import React from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

interface WishlistItem {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  price?: string;
}

interface WishlistProps {
  onAddToCart: (item: WishlistItem) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onAddToCart }) => {
  const [wishlistItems, setWishlistItems] = React.useState<WishlistItem[]>([
    {
      id: 1,
      name: "Cordless Drill",
      description: "Powerful and compact drill with 20V battery",
      imageUrl: "https://via.placeholder.com/120?text=Drill",
      price: "$129.99",
    },
    {
      id: 2,
      name: "Mountain Bike",
      description: "Lightweight aluminum frame, 21-speed gears",
      imageUrl: "https://via.placeholder.com/120?text=Bike",
      price: "$899.00",
    },
    {
      id: 3,
      name: "Camping Tent",
      description: "4-person waterproof tent with quick setup",
      imageUrl: "https://via.placeholder.com/120?text=Tent",
      price: "$199.50",
    },
  ]);

  const removeItem = (id: number) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-red-600">
        <Heart className="w-8 h-8" /> My Wishlist
      </h2>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-6">
          {wishlistItems.map(({ id, name, description, imageUrl, price }) => (
            <li
              key={id}
              className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <img
                src={imageUrl || "https://via.placeholder.com/120?text=No+Image"}
                alt={name}
                className="w-28 h-28 object-cover rounded-lg sm:mr-6 mb-4 sm:mb-0"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <p className="text-gray-600 mt-1">{description}</p>
                {price && <p className="text-green-700 font-semibold mt-2">{price}</p>}
              </div>

              <div className="flex gap-4 mt-4 sm:mt-0 sm:flex-col sm:items-end">
                <button
                  onClick={() => onAddToCart({ id, name, description, imageUrl, price })}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  aria-label={`Add ${name} to cart`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => removeItem(id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-md border border-red-600 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${name} from wishlist`}
                >
                  <Trash2 className="w-5 h-5" />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
