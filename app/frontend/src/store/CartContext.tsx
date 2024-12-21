import { createContext, useReducer, useEffect } from 'react';

// Define the type for a cart item
interface CartItem {
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	imageUrl: string;
}

// Define the type for the context state
interface CartState {
	items: CartItem[];
}

// Define the type for the context value
interface CartContextValue extends CartState {
	addItem: (item: Omit<CartItem, 'quantity'>) => void;
	removeItem: (id: number) => void;
	deleteItem: (id: number) => void;
	submitOrder: () => void;
}

// Create the context with a default value
const CartContext = createContext<CartContextValue>({
	items: [],
	addItem: () => {},
	removeItem: () => {},
	deleteItem: () => {},
	submitOrder: () => {}
});

function cartReducer(state, action) {
	if (action.type === 'ADD_PRODUCT') {
		console.log('Adding to cart (Cart Context):', action.item);
		const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);

		const updatedItems = [...state.items];

		if (existingCartItemIndex > -1) {
			// const existingCartItem = state.items[existingCartItemIndex];
			const updatedItem = {
				...state.items[existingCartItemIndex],
				quantity: state.items[existingCartItemIndex].quantity + +1
			};
			updatedItems[existingCartItemIndex] = updatedItem;
		} else {
			updatedItems.push({ ...action.item, quantity: 1 });
		}

		localStorage.setItem('cart', JSON.stringify(updatedItems));

		return { ...state, items: updatedItems };
	}
	if (action.type === 'REMOVE_PRODUCT') {
		// get
		const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
		console.log('Removing from cart (Cart Context):', existingCartItemIndex);

		const existingCartItem = state.items[existingCartItemIndex];

		if (!existingCartItem) {
			return state;
		}

		const updatedItems = [...state.items];

		if (existingCartItem.quantity === 1) {
			updatedItems.splice(existingCartItemIndex, 1); // remove 1 item from the array at the index of existingCartItemIndex
		} else {
			const updatedItem = { ...existingCartItem, quantity: existingCartItem.quantity - 1 };

			updatedItems[existingCartItemIndex] = updatedItem;
		}
		localStorage.setItem('cart', JSON.stringify(updatedItems));
		return { ...state, items: updatedItems };
	}

	if (action.type === 'LOAD_CART') {
		const updatedItems = [...action.items];

		return { ...state, items: updatedItems };
	}

	if (action.type === 'DELETE_PRODUCT') {
		const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
		const updatedItems = [...state.items];
		updatedItems.splice(existingCartItemIndex, 1);
		localStorage.setItem('cart', JSON.stringify(updatedItems));
		return { ...state, items: updatedItems };
	}

	if (action.type === 'SUBMIT_ORDER') {
		localStorage.setItem('cart', JSON.stringify([]));
		return { ...state, items: [] };
	}

	return state;
}

export function CartContextProvider({ children }) {
	const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

	function addItem(item) {
		dispatchCartAction({ type: 'ADD_PRODUCT', item: item });
	}

	function removeItem(id) {
		dispatchCartAction({ type: 'REMOVE_PRODUCT', id: id });
	}

	function loadItems(items) {
		dispatchCartAction({ type: 'LOAD_CART', items: items });
	}

	function deleteItem(id) {
		dispatchCartAction({ type: 'DELETE_PRODUCT', id: id });
	}

	function submitOrder() {
		dispatchCartAction({ type: 'SUBMIT_ORDER' });
	}

	useEffect(() => {
		// Load the cart from local storage

		if (localStorage.getItem('cart') !== undefined && localStorage.getItem('cart') !== null) {
			const storedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') as string) : null;
			console.log('storedCart', storedCart);
			loadItems(storedCart);
		}
	}, []); // empty "[]" means it has no dependencies attached to this useEffect() function

	console.log({
		items: cart.items,
		addItem: addItem,
		removeItem: removeItem
	});

	return (
		<CartContext.Provider
			value={{
				items: cart.items,
				addItem: addItem,
				removeItem: removeItem,
				submitOrder: submitOrder,
				deleteItem: deleteItem
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export default CartContext;
