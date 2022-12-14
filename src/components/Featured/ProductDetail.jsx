import getSymbolFromCurrency from "currency-symbol-map";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CartContext from "../../context/CartContext";
import { Button } from "../Button/Button";
import ImageSlider from "../HeroSlider/ImageSlider";
import { toast } from "react-toastify";
import { toastOptions } from "./ProductItem";
import { Helmet } from "react-helmet";
import AddToCartModal from "../../pages/Cart/AddToCartModal";
import AnimatedModal from "../AnimatedModal/AnimatedModal";

const ProductDetail = ({}) => {
  const location = useLocation();
  // const { category } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [itemSize, setItemSize] = useState("");
  console.log(location.state.item);
  const product = location.state.item;
  const { cartItems, setCartItems } = useContext(CartContext);

  const percetage = (product.price - product.discount_price) / product.price;
  // setPercentageDiscount(percetage * 100);
  const handleAddToCart = (item) => {
    const index = cartItems.findIndex((cartItem) => cartItem._id === item._id);
    if (index >= 0) {
      toast.success(<ClickableToast text="Already in cart" />, toastOptions);
      return;
    }
    item.quantityToBuy = 1;
    setCartItems((prev) => [item, ...prev]);
    toast.success(<ClickableToast />, toastOptions);
  };

  return (
    <div
      className="class_justify_contents_row"
      style={{
        justifyContent: "left",
        padding: "2rem",
        alignItems: "start",
        flexDirection: window.innerWidth < 760 && "column",
        // width: "100%",
      }}
    >
      <AnimatedModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalHeight="250px"
        bkdropclassName={"full_backdrop"}
      >
        <AddToCartModal
          item={product}
          setItemSize={setItemSize}
          itemSize={itemSize}
          setOpenModal={setOpenModal}
        />
      </AnimatedModal>
      <Helmet>
        <title>Product - {`${product.product_name}`}</title>
        <meta
          name="description"
          content={"Product description of " + `${product.product_name}`}
        />
      </Helmet>
      {/* <img src={product.image} alt="" height={"300px"} /> */}
      <ImageSlider
        slides={product.images}
        isNotMap={true}
        imageStyle={{
          // maxHeight: "180px",
          // maxWidth: "180px",
          height: "180px",
          width: "99.3%",
        }}
        style={{
          height: window.innerWidth < 660 ? "" : "300px",
          width: window.innerWidth < 660 ? "" : "400px",
        }}
      />
      <div style={{ padding: "15px" }}>
        <h3
          style={{ textAlign: "left", margin: 0 }}
          className="product-item-name"
        >
          {product.product_name ?? "HTML/CSS"}
        </h3>
        <div
          style={{
            fontSize: "2.8w",
            display: "flex",
            gap: "5px",
            fontWeight: "bold",
          }}
        >
          <div className="more_pop">In Stock:</div>
          {product.quantity} items
        </div>
        {/* <div style={{ w }}></div> */}
        <p
          className="avenir_class"
          style={{ lineHeight: "inherit", width: "80%" }}
        >
          {product.description}
        </p>
        <pre
          style={{ textAlign: "left" }}
          className={"avenir_class gold_color_text"}
        >
          CATEGORY- {product.category ?? "HTML/CSS"}
        </pre>
        <h4 style={{ margin: 0 }}>
          Price: {getSymbolFromCurrency("INR") + "  " + product.discount_price}
        </h4>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{
              textDecoration: "line-through",
              color: "grey",
            }}
          >
            {getSymbolFromCurrency("INR") + "  " + product.price}
          </p>
          <p className="more_pop">{(percetage * 100).toFixed(0) + "%"}</p>
        </div>
        <Button
          buttonColor={"gold"}
          buttonStyle={'btn--normal"'}
          children={"Add to Cart"}
          onClick={() => setOpenModal(true)}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
