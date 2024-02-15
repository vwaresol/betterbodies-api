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
  ERROR_UPDATE_PAYMENT: 'Error update the payment',
};

export const orderStatusDictionaryForEmial = {
  Created: 'created',
  'On Process': 'on process',
  'On Transit': 'on transit',
  Delivered: 'delivered',
  Canceled: 'canceled',
};
