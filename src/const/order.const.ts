export const columnsSort = {
  order: 'order.orderNumber',
  total: 'order.total',
  picked: 'order.picked',
  date: 'order.createdAt',
  status: 'status.status',
};

export const orderErrorsConst = {
  ERROR_ORDER_NOT_FOUND: 'Order not found',
  ERROR_CREATING_ORDER: 'Error Creating Order',
  ERROR_GETTING_ORDERS: 'Error getting orders',
  ERROR_EMPTY_COMMENT: 'Need to add a comment to cancel the order',
};
