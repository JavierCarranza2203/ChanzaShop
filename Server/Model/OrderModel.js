export class Order {
    OrderId;
    CustomerId;
    Date;
    Time;
    ProductList;

    constructor(customerId, OrderId = 0){
        this.CustomerId = customerId;
        this.OrderId = 0;
        this.ProductList = []
    }
}