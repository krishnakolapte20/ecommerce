import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../home/ProductCard";
import Loader from "../layouts/loader/Loader";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import "./products.css";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MetaData";

const categories = [
	"Laptop",
	"Footwear",
	"Bottom",
	"Tops",
	"Attire",
	"Camera",
	"SmartPhones",
];

const Products = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector((state) => state.user);
	const {
		products,
		loading,
		error,
		productsCount,
		resultPerPage,
		filteredProductsCount,
	} = useSelector((state) => state.products);
	const keyword = useParams("");
	const alert = useAlert();

	const [currentPage, setCurrentPage] = useState(1);
	const [price, setPrice] = useState([0, 25000]);
	const [category, setCategory] = useState("");
	const [ratings, setRatings] = useState(0);

	const dispatch = useDispatch();

	const setCurrentPageNo = (e) => {
		setCurrentPage(e);
	};

	const priceHandler = (e, newPrice) => {
		setPrice(newPrice);
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
		if (isAuthenticated === false) {
			navigate("/products");
		}
		dispatch(
			getProduct(keyword.keyword, currentPage, price, category, ratings)
		);
	}, [
		dispatch,
		keyword.keyword,
		currentPage,
		price,
		category,
		ratings,
		alert,
		error,
		isAuthenticated,
		navigate,
	]);

	let count;
	if (productsCount > 8) {
		count = filteredProductsCount;
	} else {
		count = productsCount;
	}
	if (filteredProductsCount < 8) {
		count = filteredProductsCount;
	} else {
		count = productsCount;
	}

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title="PRODUCTS -- ECOMMERCE" />
					<h2 className="productsHeading">Products</h2>

					<div className="products">
						{products &&
							products.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
								/>
							))}
					</div>
					<div className="filterBox">
						<Typography>Price</Typography>
						<Slider
							value={price}
							onChange={priceHandler}
							valueLabelDisplay="auto"
							aria-labelledby="range-slider"
							min={0}
							max={25000}
						/>
						<Typography>Categories</Typography>
						<ul className="categoryBox">
							{categories.map((category) => (
								<li
									className="category-link"
									key={category}
									onClick={() => setCategory(category)}
								>
									{category}
								</li>
							))}
						</ul>
						<fieldset>
							<Typography component="legend">
								Ratings Above
							</Typography>
							<Slider
								value={ratings}
								onChange={(e, newRating) => {
									setRatings(newRating);
								}}
								aria-labelledby="continuous-slider"
								valueLabelDisplay="auto"
								min={0}
								max={5}
							/>
						</fieldset>
					</div>

					{resultPerPage < count && (
						<div className="paginationBox">
							<Pagination
								activePage={currentPage}
								itemsCountPerPage={resultPerPage}
								totalItemsCount={productsCount}
								onChange={setCurrentPageNo}
								nextPageText="Next"
								prevPageText="Prev"
								firstPageText="1st"
								lastPageText="Last"
								itemClass="page-item"
								linkClass="page-link"
								activeClass="pageItemActive"
								activeLinkClass="pageLinkActive"
							/>
						</div>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default Products;
