import React, { useEffect, useState } from "react";
import SideBar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteProductAsync,
    updateProductAsync,
    getProductDetailsAsync,
    CLEAR_PRODUCT_DELETE
} from "../../../redux/Product/ProductSlice";
import Spinner from "../../../components/Spinner";
import CloseIcon from "@mui/icons-material/Close";

const category = [
    "Travel",
    "Watch",
    "Laptop",
    "SmartPhones",
    "UpperWear",
    "Jacket",
    "BottomWear",
];

const ProductManage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading: productDetailsLoading, product } = useSelector(
        (state) => state.product.productDetails
    );
    const { loading: productUpdateLoading } = useSelector(
        (state) => state.product.productUpdate
    );
    const { loading: productDeleteLoading, success : productDeleteSuccess } = useSelector(
        (state) => state.product.productDelete
    );
    const [inputData, setInputData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        noOfStock: "",
        images: [],
    });
    const [inputDataError, setInputDataError] = useState({
        name: null,
        description: null,
        price: null,
        category: null,
        noOfStock: null,
        images: null,
    });

    useEffect(() => {
        dispatch(getProductDetailsAsync(id));
    }, []);

    useEffect(() => {
        if(product){
            setInputData({
                name: product?.name || "",
                description: product?.description || "",
                price: product?.price || "",
                category: product?.category || "",
                noOfStock: product?.noOfStock || "",
                images: product?.images || [],
            });
        }
        if(productDeleteSuccess){
            dispatch(CLEAR_PRODUCT_DELETE())
            setInputData({
                name: "",
                description: "",
                price: "",
                category: "",
                noOfStock: "",
                images: [],
            })
            navigate("/admin/products");
        }
    }, [product, productDeleteSuccess]);

    const setInputDataHandler = (key, value) => {
        if (key === "images") {
            const file = value;
            const reader = new FileReader();
            reader.onloadend = () => {
                setInputData((prevState) => ({
                    ...prevState,
                    images: [...prevState.images, reader.result],
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setInputData((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        }
    };
    const removeImage = (index) => {
        setInputData((prevState) => ({
            ...prevState,
            images: prevState.images.filter((_, i) => i != index),
        }));
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        dispatch(
            updateProductAsync({
                id,
                name: inputData.name,
                description: inputData.description,
                price: inputData.price,
                category: inputData.category,
                noOfStock: inputData.noOfStock,
                images: inputData.images,
            })
        );
    };

    const deleteHandler = async (e) => {
        e.preventDefault();
        dispatch(deleteProductAsync(id));
    };
    return (
        <>
            {productDetailsLoading && <Spinner />}
            {!productDetailsLoading && (
                <div className="min-h-screen bg-gray-100 border-box overflow-x-scroll">
                    <div className="mt-[60px] text-gray-900 flex flex-wrap gap-x-1">
                        <SideBar />
                        <div className="w-full p-4 sm:ml-60 mt-2 sm:mt-0 flex items-center justify-center">
                            <div className="w-full sm:w-4/5 lg:w-3/5 flex flex-col gap-y-2 bg-white rounded shadow-lg p-4 md:px-8">
                                <div className="font-bold w-full text-lg sm:text-xl md:text-2xl text-center">
                                    Manage Product
                                </div>

                                <form
                                    className="space-y-2"
                                    method="POST"
                                    encType="multipart/form-data"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="name"
                                            value={inputData.name}
                                            onChange={(e) =>
                                                setInputDataHandler(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={30}
                                            placeholder="Rashika Sahu"
                                            className="pl-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <div className="text-red-500 text-xs">
                                            {inputDataError.name}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            type="text"
                                            autoComplete="email"
                                            value={inputData.description}
                                            onChange={(e) =>
                                                setInputDataHandler(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            maxLength={250}
                                            placeholder="describe the product..."
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <div className="text-red-500 text-xs">
                                            {inputDataError.description}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Price
                                        </label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={inputData.price}
                                            onChange={(e) =>
                                                setInputDataHandler(
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={15}
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <div className="text-red-500 text-xs">
                                            {inputDataError.price}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="stock"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Stock
                                        </label>
                                        <input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            value={inputData.noOfStock}
                                            onChange={(e) =>
                                                setInputDataHandler(
                                                    "noOfStock",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={15}
                                            className="pl-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <div className="text-red-500 text-xs">
                                            {inputDataError.noOfStock}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Category
                                        </label>
                                        <div className="h-10 flex rounded items-center mt-1 w-full">
                                            <select
                                                id="category"
                                                name="category"
                                                autoComplete="category"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                value={inputData.category}
                                                onChange={(e) =>
                                                    setInputDataHandler(
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {category.map((c, index) => (
                                                    <option key={index}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="text-red-500 text-xs">
                                            {inputDataError.category}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-1">
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Image
                                        </label>
                                        <div className="h-fit w-full flex flex-wrap gap-x-2 gap-y-1 items-center">
                                            {inputData.images?.map(
                                                (image, index) => (
                                                    <div key={index}>
                                                        <div
                                                            className="relative -right-1 font-bold cursor-pointer"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <CloseIcon />
                                                        </div>
                                                        <img
                                                            src={
                                                                image.url ||
                                                                image
                                                            }
                                                            className="h-14 w-14 sm:h-20 sm:w-20 rounded"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <input
                                            id="images"
                                            name="images"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setInputDataHandler(
                                                    "images",
                                                    e.target.files[0]
                                                )
                                            }
                                        />

                                        <div className="text-red-500 text-xs">
                                            {inputDataError.images}
                                        </div>
                                    </div>

                                    <div className="flex justify-around gap-x-2">
                                        <input
                                            type="submit"
                                            value={`${
                                                productUpdateLoading
                                                    ? "Updating..."
                                                    : "Update"
                                            }`}
                                            className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                                            onClick={(e) => updateHandler(e)}
                                            disabled={productUpdateLoading}
                                        />
                                        <input
                                            type="submit"
                                            value={`${
                                                productDeleteLoading
                                                    ? "Deleting..."
                                                    : "Delete"
                                            }`}
                                            className="mt-4 flex w-full justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                                            onClick={(e) => deleteHandler(e)}
                                            disabled={productDeleteLoading}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductManage;

const formValidation = ({ inputData, setInputDataError }) => {
    let validation = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (key, condition, errorMessage) => {
        if (condition) {
            setInputDataError((prevState) => ({
                ...prevState,
                [key]: errorMessage,
            }));
            validation = false;
        } else {
            setInputDataError((prevState) => ({
                ...prevState,
                [key]: null,
            }));
        }
    };

    return validation;
};
