export const ejsviewController = async (req, res) => {
    try {
        res.render("index", { message: "Hello from Express + EJS!", name: "jaspal" });

        // res.status(200).send("hello jaspal")
    } catch (error) {
        res.status(500).send(" some error ")
        console.log("error: ", error);

    }
}


export const renderInvoice = (req, res) => {
    const data = {
        customer: "John Doe",
        date: new Date().toLocaleDateString(),
        items: [
            { name: "Laptop", qty: 1, price: 1200 },
            { name: "Mouse", qty: 2, price: 40 },
            { name: "Mobile", qty: 5, price: 1000 },
        ],
        total: 2240,
    };

    res.render("invoice", data);
};
