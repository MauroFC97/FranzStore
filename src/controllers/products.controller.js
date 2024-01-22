import Product from "../models/products.model.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};
export const createProduct = async (req, res) => {
  try {
    const { title, price, description, stock, category } = req.body;
    console.log(req.file);

    // Validar que los datos requeridos estén presentes
    if (!title || !price || !description || !stock || !category) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Validar que el título no esté repetido
    const isRepeated = await Product.find({ title });
    if (isRepeated.length > 0) {
      return res
        .status(400)
        .json({ message: "El titulo del producto ya existe" });
    }

    const availableCategories = [
      "Egresados",
      "Ropa de verano",
      "Ropa de invierno",
      "Todo el año",
    ];

    // Validar que la categoria sea una de las permitidas
    if (!availableCategories.includes(category)) {
      return res.status(400).json({ message: "Categoria no permitida" });
    }

    // Crear el producto
    const product = new Product({
      title,
      price,
      description,
      stock,
      thumbnail: req.file.filename,
      category,
    });
    // Guardar el producto en la DB
    const savedProduct = await product.save();
    // Devolver el producto guardado
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear un producto" });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const title = req.params.title;
    const product = await Product.findOne({ title });
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener un producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { price, description, stock, category } = req.body;
    const title = req.params.title;
    const product = await Product.findByIdAndUpdate(
      { title },
      {
        price,
        description,
        stock,
        category,
      },
      { new: true }
    );
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar un producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const title = req.params.title;
    const product = await Product.findOneAndDelete({ title });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.sendStatus(200).json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar un producto" });
  }
};
