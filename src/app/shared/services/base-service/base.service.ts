import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  USER_LIST_API,
  USER_REGISTER_API,
  ROLE_LIST_API,
  GROUP_LIST_API,
  MANAGE_GROUP_TO_ROLE_API,
  MANAGE_ROLE_TO_GROUP_API,
  MANAGE_USER_TO_GROUP_API,
  PRODUCT_CATEGORY_LIST_API,
  PRODUCT_SUB_CATEGORY_LIST_API,
  PRODUCT_LIST_API,
  CLIENT_LIST_API,
  BANK_CALCULATOR_API,
  POINT_CALCULATOR_API,
  COUPON_LIST_API,
  PERMISSION_API,
  LOCATION_API,
  UNIT_API,
  WORK_SLOT_FILE_LIST_API,
  WORK_SLOT_FILE_LIST_MISSING_API,
  CHANGE_WORK_SLOT_STATUS,
  MANAGE_PERMISSION_TO_ROLE_API,
  PERMISSION_BY_ROLE_API,
  PRODUCT_VARIANT_API,
  SETTLEMENT_API,
  PRODUCT_APPROVE_API,
  CATEGORY_APPROVE_API,
  WEBSITE_TRANSACTION_LIST_API,
  WEBSITE_EXPENSE_LIST_API,
  WORK_SLOT_LIST_API,
  WEBSITE_LIST_API,
  BANK_LIST_API,
  WORK_SHEET_API,
  SYNC_WORKSHEET,
  TRANSACTION_HISTORY_LIST_API,
  WEBSITE_TRANSACTION_STATUS_UPDATE,
  DASBOARD_API,
  FILTER_TRANSACTION_LIST_API,
  WORK_SHEET_API_STATUS,
  ADMIN_BANK_MAP_API,
  BANK_AMOUNT_TRANSFER_API,
  BANK_TRANSACTION_API,
  BANK_TRANSFER_API,
  RECOVERY_LIST_API,
  RECOVERY_STATUS_API,
  ENTRY_CORRECTION_LIST_API,
  RECOVERY_STATUS_UPDATE_API,
  BRANCH_LIST_API,
  PAYMENT_METHOD_API,
  BRANCH_API,
  NOTIFICATION_API,
  BANNER_API,
  OFFER_API,
  USER_REQUEST_LIST,
  DEPOSIT_PAYMENT_METHOD_API,
  USER_REQUEST_API,
  UPDATE_USER_REQUEST_API,
  USER_REQUEST_TYPE,
  PUSH_NOTIFICATION_LIST_API,
  MISSING_BBMS_ENTRY_WORK_SLOT,
  SYNC_BBMS_ENTRY_WORK_SLOT,
  UserType_LIST_API,
  UserBank_LIST_API,
  Branch_WEBSITE_LIST_API,
  GET_AVAILABE_BALANCE,
  ChildUser_LIST_API,
} from 'src/app/shared/api/api.constant';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(private http: HttpClient) { }

  getAllBranch() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(BRANCH_LIST_API, { params });
  }

  getDashboardItems(data) {
    return this.http.post<Response>(DASBOARD_API, data);
  }
  getUserList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(USER_LIST_API, { params });
  }

  getPushNotification() {
    return this.http.get<Response>(`${PUSH_NOTIFICATION_LIST_API}`);
  }

  getUser(id) {
    return this.http.get<Response>(`${USER_LIST_API}/${id}`);
  }

  deleteUser(id) {
    return this.http.delete<Response>(`${USER_LIST_API}/${id}`);
  }

  createUser(user) {
    return this.http.post<Response>(USER_REGISTER_API, user);
  }

  updateUser(user, id) {
    return this.http.post<Response>(`${USER_LIST_API}/${id}`, user);
  }

  getRoleList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(ROLE_LIST_API, { params });
  }

  getRole(id) {
    return this.http.get<Response>(`${ROLE_LIST_API}/${id}`);
  }

  getPermissionByRole(id) {
    return this.http.get<Response>(`${PERMISSION_BY_ROLE_API}/${id}`);
  }

  deleteRole(id) {
    return this.http.delete<Response>(`${ROLE_LIST_API}/${id}`);
  }

  createRole(role) {
    return this.http.post<Response>(ROLE_LIST_API, role);
  }

  updateRole(role, id) {
    return this.http.post<Response>(`${ROLE_LIST_API}/${id}`, role);
  }

  assignPermissionToRole(data, id) {
    return this.http.post<Response>(
      `${MANAGE_PERMISSION_TO_ROLE_API}/${id}`,
      data
    );
  }

  assignGroupToRole(data, id) {
    return this.http.post<Response>(`${MANAGE_GROUP_TO_ROLE_API}/${id}`, data);
  }

  assignUserToGroup(data, id) {
    return this.http.post<Response>(`${MANAGE_USER_TO_GROUP_API}/${id}`, data);
  }

  assignrolestogroup(data, id) {
    return this.http.post<Response>(`${MANAGE_ROLE_TO_GROUP_API}/${id}`, data);
  }

  getGroupList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(GROUP_LIST_API, { params });
  }

  getUserListAll() {
    return this.http.get<Response>(USER_LIST_API);
  }

  getGroupListAll() {
    return this.http.get<Response>(GROUP_LIST_API);
  }

  getRoleListAll() {
    return this.http.get<Response>(ROLE_LIST_API);
  }

  getGroup(id) {
    return this.http.get<Response>(`${GROUP_LIST_API}/${id}`);
  }

  deleteGroup(id) {
    return this.http.delete<Response>(`${GROUP_LIST_API}/${id}`);
  }

  createGroup(group) {
    return this.http.post<Response>(GROUP_LIST_API, group);
  }

  updateGroup(group, id) {
    return this.http.post<Response>(`${GROUP_LIST_API}/${id}`, group);
  }

  getCategoryList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(PRODUCT_CATEGORY_LIST_API, { params });
  }

  getCategoryData() {
    return this.http.get<Response>(PRODUCT_CATEGORY_LIST_API);
  }

  getCategory(id) {
    return this.http.get<Response>(`${PRODUCT_CATEGORY_LIST_API}/${id}`);
  }

  createCategory(category) {
    return this.http.post<Response>(PRODUCT_CATEGORY_LIST_API, category);
  }

  updateCategory(category, id) {
    return this.http.post<Response>(
      `${PRODUCT_CATEGORY_LIST_API}/${id}`,
      category
    );
  }

  approveCategory(id) {
    return this.http.get<Response>(`${CATEGORY_APPROVE_API}/${id}`);
  }

  deleteCategory(id) {
    return this.http.delete<Response>(`${PRODUCT_CATEGORY_LIST_API}/${id}`);
  }

  getSubCategoryList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(PRODUCT_SUB_CATEGORY_LIST_API, { params });
  }

  createSubCategory(subCategory) {
    return this.http.post<Response>(PRODUCT_SUB_CATEGORY_LIST_API, subCategory);
  }

  updateSubCategory(subCategory, id) {
    return this.http.post<Response>(
      `${PRODUCT_SUB_CATEGORY_LIST_API}/${id}`,
      subCategory
    );
  }

  getSubCategory(id) {
    return this.http.get<Response>(`${PRODUCT_SUB_CATEGORY_LIST_API}/${id}`);
  }

  getAllCategory() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(PRODUCT_CATEGORY_LIST_API, { params });
  }

  postProductGalary(id, data, url) {
    return this.http.post<Response>(`${url}/${id}`, data);
  }

  deleteImage(id, data) {
    return this.http.post<Response>(`${WORK_SHEET_API}/${id}`, data);
  }

  statusUpdate(id) {
    return this.http.get<Response>(`${WORK_SHEET_API_STATUS}/${id}`);
  }

  getLocation() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(LOCATION_API, { params });
  }

  getAllUnit() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(UNIT_API, { params });
  }

  getAllSubCategory() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(PRODUCT_SUB_CATEGORY_LIST_API, { params });
  }

  deleteSubCategory(id) {
    return this.http.delete<Response>(`${PRODUCT_SUB_CATEGORY_LIST_API}/${id}`);
  }

  getProductList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(PRODUCT_LIST_API, { params });
  }

  getCouponList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(COUPON_LIST_API, { params });
  }

  createCoupon(coupon) {
    return this.http.post<Response>(COUPON_LIST_API, coupon);
  }

  updateCoupon(coupon, id) {
    return this.http.post<Response>(`${COUPON_LIST_API}/${id}`, coupon);
  }

  getCoupon(id) {
    return this.http.get<Response>(`${COUPON_LIST_API}/${id}`);
  }

  deleteCoupon(id) {
    return this.http.delete<Response>(`${COUPON_LIST_API}/${id}`);
  }

  getClientList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(CLIENT_LIST_API, { params });
  }

  getClient(id) {
    return this.http.get<Response>(`${CLIENT_LIST_API}/${id}`);
  }

  getAllClient() {
    let url = CLIENT_LIST_API + '?is_dropdown=1';
    return this.http.get<Response>(url);
  }

  createClient(client) {
    return this.http.post<Response>(CLIENT_LIST_API, client);
  }

  updateClient(client, id) {
    return this.http.post<Response>(`${CLIENT_LIST_API}/${id}`, client);
  }

  deleteClient(id) {
    return this.http.delete<Response>(`${CLIENT_LIST_API}/${id}`);
  }

  getExpenseList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(WEBSITE_EXPENSE_LIST_API, { params });
  }

  getExpense(id) {
    return this.http.get<Response>(`${WEBSITE_EXPENSE_LIST_API}/${id}`);
  }

  getAllExpense() {
    return this.http.get<Response>(WEBSITE_EXPENSE_LIST_API);
  }

  createExpense(client) {
    return this.http.post<Response>(WEBSITE_EXPENSE_LIST_API, client);
  }

  updateExpense(client, id) {
    return this.http.post<Response>(
      `${WEBSITE_EXPENSE_LIST_API}/${id}`,
      client
    );
  }

  deleteExpense(id) {
    return this.http.delete<Response>(`${WEBSITE_EXPENSE_LIST_API}/${id}`);
  }

  getEntryCorrectionList(page, pageSize, search, orderBy, orderType) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('orderBy', orderBy)
      .append('orderType', orderType);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(ENTRY_CORRECTION_LIST_API, { params });
  }

  deleteEntryCorrection(id) {
    return this.http.delete<Response>(`${ENTRY_CORRECTION_LIST_API}/${id}`);
  }

  updateEntryCorrectionStatus(id) {
    return this.http.get<Response>(`${ENTRY_CORRECTION_LIST_API}/${id}`);
  }

  getEntryCorrection(id) {
    return this.http.get<Response>(`${ENTRY_CORRECTION_LIST_API}/${id}`);
  }

  updateEntryCorrection(client, id) {
    return this.http.post<Response>(`${RECOVERY_LIST_API}/${id}`, client);
  }

  getTransactionHistoryList(id, page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(`${TRANSACTION_HISTORY_LIST_API}/${id}`, {
      params,
    });
  }

  getRecoveryList(page, pageSize, search, orderBy, orderType) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('orderBy', orderBy)
      .append('orderType', orderType);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(RECOVERY_LIST_API, { params });
  }

  deleteRecovery(id) {
    return this.http.delete<Response>(`${RECOVERY_LIST_API}/${id}`);
  }

  updateRecoveryStatus(id) {
    return this.http.get<Response>(`${RECOVERY_STATUS_UPDATE_API}/${id}`);
  }

  getRecovery(id) {
    return this.http.get<Response>(`${RECOVERY_LIST_API}/${id}`);
  }

  createRecovery(client) {
    return this.http.post<Response>(RECOVERY_LIST_API, client);
  }

  updateRecovery(client, id) {
    return this.http.post<Response>(`${RECOVERY_LIST_API}/${id}`, client);
  }

  getRecoveryStatus(id) {
    return this.http.get<Response>(`${RECOVERY_STATUS_API}/${id}`);
  }

  getAvailableBalance(website_id) {
    return this.http.get<Response>(`${GET_AVAILABE_BALANCE}/${website_id}`);
  }

  getTransactionList(page, pageSize, search, orderBy, orderType) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('orderBy', orderBy)
      .append('orderType', orderType);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(WEBSITE_TRANSACTION_LIST_API, { params });
  }

  getTransaction(id) {
    return this.http.get<Response>(`${WEBSITE_TRANSACTION_LIST_API}/${id}`);
  }

  getAllTransaction() {
    return this.http.get<Response>(WEBSITE_TRANSACTION_LIST_API);
  }

  createTransaction(client) {
    return this.http.post<Response>(WEBSITE_TRANSACTION_LIST_API, client);
  }

  updateTransaction(client, id) {
    return this.http.post<Response>(
      `${WEBSITE_TRANSACTION_LIST_API}/${id}`,
      client
    );
  }

  deleteTransaction(id) {
    return this.http.delete<Response>(`${WEBSITE_TRANSACTION_LIST_API}/${id}`);
  }

  updateTransactionStatus(id) {
    return this.http.get<Response>(
      `${WEBSITE_TRANSACTION_STATUS_UPDATE}/${id}`
    );
  }

  getWorkSlotList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(WORK_SLOT_LIST_API, { params });
  }

  getWorkSlotFileList(
    page,
    pageSize,
    search,
    id,
    tab,
    { amount, action_id, client_id, website_id, start_date_time, end_date_time }
  ) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('amount', amount)
      .append('action_id', action_id)
      .append('client_id', client_id)
      .append('website_id', website_id)
      .append('start_date_time', start_date_time)
      .append('end_date_time', end_date_time)
      .append('view_work_slot_id', '0')
      .append('view_workslot_sheet_id', id);
    if (search) params = params.append('filterkey', search);
    const url =
      tab === 'all'
        ? `${WORK_SLOT_FILE_LIST_API}/${id}`
        : `${WORK_SLOT_FILE_LIST_MISSING_API}/${id}`;
    return this.http.get<Response>(url, { params });
  }

  getViewWorkSlotList(
    page,
    pageSize,
    search,
    id,
    tab,
    { amount, action_id, client_id, website_id, start_date_time, end_date_time }
  ) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('amount', amount)
      .append('action_id', action_id)
      .append('client_id', client_id)
      .append('website_id', website_id)
      .append('start_date_time', start_date_time)
      .append('end_date_time', end_date_time)
      .append('view_work_slot_id', id)
      .append('view_workslot_sheet_id', '0');
    if (search) params = params.append('filterkey', search);
    const url = this.getTabData(tab, id);
    return this.http.get<Response>(url, { params });
  }

  getTabData(tab, id) {
    let url;
    if (tab === 'all') url = `${WORK_SLOT_FILE_LIST_API}/${id}`;
    else if (tab === 'missing')
      url = `${WORK_SLOT_FILE_LIST_MISSING_API}/${id}`;
    else if (tab === 'extra') url = `${MISSING_BBMS_ENTRY_WORK_SLOT}/${id}`;
    return url;
  }

  changeWorkSlotStatus(id) {
    return this.http.get<Response>(`${CHANGE_WORK_SLOT_STATUS}/${id}`);
  }

  getSyncWorksheet(id) {
    return this.http.get<Response>(`${SYNC_WORKSHEET}/${id}`);
  }
  getSyncWorkSlot(id) {
    return this.http.get<Response>(`${SYNC_BBMS_ENTRY_WORK_SLOT}/${id}`);
  }

  getWorkSlot(id) {
    return this.http.get<Response>(`${WORK_SLOT_LIST_API}/${id}`);
  }

  getAllWorkSlot() {
    return this.http.get<Response>(WORK_SLOT_LIST_API);
  }

  createWorkSlot(client) {
    return this.http.post<Response>(WORK_SLOT_LIST_API, client);
  }

  updateWorkSlot(client, id) {
    return this.http.post<Response>(`${WORK_SLOT_LIST_API}/${id}`, client);
  }

  deleteWorkSlot(id) {
    return this.http.delete<Response>(`${WORK_SLOT_LIST_API}/${id}`);
  }

  getWebsiteList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(WEBSITE_LIST_API, { params });
  }

  getWebsite(id) {
    return this.http.get<Response>(`${WEBSITE_LIST_API}/${id}`);
  }

  getAllWebsite() {
    return this.http.get<Response>(WEBSITE_LIST_API);
  }

  getBranchWebsite() {
    return this.http.get<Response>(Branch_WEBSITE_LIST_API);
  }

  getBranchWebsiteById(id) {
    return this.http.get<Response>(`${Branch_WEBSITE_LIST_API}/${id}`);
  }

  getAllUserType() {
    return this.http.get<Response>(UserType_LIST_API);
  }
  getAllBankType() {
    return this.http.get<Response>(UserBank_LIST_API);
  }
  getAllChildUser() {
    return this.http.get<Response>(ChildUser_LIST_API);
  }

  getAllTransactionReport(
    page,
    pageSize,
    search,
    {
      amount,
      action_id,
      bank_id,
      client_id,
      website_id,
      start_date_time,
      end_date_time,
    }
  ) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('amount', amount)
      .append('action_id', action_id)
      .append('bank_id', bank_id)
      .append('client_id', client_id)
      .append('website_id', website_id)
      .append('start_date_time', start_date_time)
      .append('end_date_time', end_date_time);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(FILTER_TRANSACTION_LIST_API, { params });
  }

  getAllUserrequest(payload) {
    return this.http.post<Response>(USER_REQUEST_LIST, payload);
  }

  getUserrequest(id) {
    return this.http.get<Response>(`${USER_REQUEST_LIST}/${id}`);
  }

  getUserRequestType() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(`${USER_REQUEST_TYPE}`, { params });
  }

  createWebsite(client) {
    return this.http.post<Response>(WEBSITE_LIST_API, client);
  }

  updateWebsite(client, id) {
    return this.http.post<Response>(`${WEBSITE_LIST_API}/${id}`, client);
  }

  deleteWebsite(id) {
    return this.http.delete<Response>(`${WEBSITE_LIST_API}/${id}`);
  }

  getUserRequest(page, pageSize, search, requestTypeId, status) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('status_id', status)
      .append('request_type_id', requestTypeId);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(USER_REQUEST_API, { params });
  }

  getBankList(page, pageSize, search, status) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (status !== 3) params = params.append('inactive', status);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(BANK_LIST_API, { params });
  }

  getBank(id) {
    return this.http.get<Response>(`${BANK_LIST_API}/${id}`);
  }

  getAllBank() {
    let params = new HttpParams().append('is_dropdown', '1');
    return this.http.get<Response>(BANK_LIST_API, { params });
  }

  getAllBankSearch(search) {
    let params = new HttpParams().append('is_dropdown', '1');
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(CLIENT_LIST_API, { params });
  }

  createBank(client) {
    return this.http.post<Response>(BANK_LIST_API, client);
  }

  updateBank(client, id) {
    return this.http.post<Response>(`${BANK_LIST_API}/${id}`, client);
  }

  deleteBank(id) {
    return this.http.delete<Response>(`${BANK_LIST_API}/${id}`);
  }

  getProduct(id) {
    return this.http.get<Response>(`${PRODUCT_LIST_API}/${id}`);
  }

  getAllProduct() {
    return this.http.get<Response>(PRODUCT_LIST_API);
  }

  createProduct(product) {
    return this.http.post<Response>(PRODUCT_LIST_API, product);
  }

  createProductVariant(variant) {
    return this.http.post<Response>(PRODUCT_VARIANT_API, variant);
  }

  updateProduct(product, id) {
    return this.http.post<Response>(`${PRODUCT_LIST_API}/${id}`, product);
  }

  approveProduct(id) {
    return this.http.get<Response>(`${PRODUCT_APPROVE_API}/${id}`);
  }

  deleteProduct(id) {
    return this.http.delete<Response>(`${PRODUCT_LIST_API}/${id}`);
  }

  getPermission() {
    return this.http.get<Response>(`${PERMISSION_API}`);
  }

  bankAmountTransfer(data) {
    return this.http.post<Response>(BANK_AMOUNT_TRANSFER_API, data);
  }

  deleteTransferAmount(id) {
    return this.http.delete<Response>(`${BANK_AMOUNT_TRANSFER_API}/${id}`);
  }

  bankTransaction(data) {
    return this.http.post<Response>(BANK_TRANSACTION_API, data);
  }

  getBankTransaction(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(BANK_TRANSACTION_API, { params });
  }

  deleteMapBankTransaction(id) {
    return this.http.delete<Response>(`${BANK_TRANSACTION_API}/${id}`);
  }

  getTransferBank(
    page,
    pageSize,
    search,
    { from_bank_id, to_bank_id, amount, utr }
  ) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize)
      .append('from_bank_id', from_bank_id)
      .append('to_bank_id', to_bank_id)
      .append('amount', amount)
      .append('utr', utr);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(BANK_TRANSFER_API, { params });
  }

  adminMapBank(data) {
    return this.http.post<Response>(ADMIN_BANK_MAP_API, data);
  }

  getMapBank(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(ADMIN_BANK_MAP_API, { params });
  }

  deleteMapBank(id) {
    return this.http.delete<Response>(`${ADMIN_BANK_MAP_API}/${id}`);
  }

  getSettlementList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(SETTLEMENT_API, { params });
  }

  deleteSettlement(id) {
    return this.http.delete<Response>(`${SETTLEMENT_API}/${id}`);
  }

  getSettlement(id) {
    return this.http.get<Response>(`${SETTLEMENT_API}/${id}`);
  }

  createSettlement(settlement) {
    return this.http.post<Response>(SETTLEMENT_API, settlement);
  }

  updateSettlement(settlement, id) {
    return this.http.post<Response>(`${SETTLEMENT_API}/${id}`, settlement);
  }

  getAllDepositPaymentMethodList() {
    let params = new HttpParams()
      .append('action_id', '1')
      .append('is_dropdown', '1');
    return this.http.get<Response>(PAYMENT_METHOD_API, { params });
  }

  getPaymentMethodTypeList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(PAYMENT_METHOD_API, { params });
  }

  deletePaymentMethodType(id) {
    return this.http.delete<Response>(`${PAYMENT_METHOD_API}/${id}`);
  }

  getPaymentMethodType(id) {
    return this.http.get<Response>(`${PAYMENT_METHOD_API}/${id}`);
  }

  createPaymentMethodType(payload) {
    return this.http.post<Response>(PAYMENT_METHOD_API, payload);
  }

  updatePaymentMethodType(payload, id) {
    return this.http.post<Response>(`${PAYMENT_METHOD_API}/${id}`, payload);
  }

  getBranchList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(`${BRANCH_API}`, { params });
  }

  deleteBranch(id) {
    return this.http.delete<Response>(`${BRANCH_API}/${id}`);
  }

  getBranch(id) {
    return this.http.get<Response>(`${BRANCH_API}/${id}`);
  }

  createBranch(payload) {
    return this.http.post<Response>(BRANCH_API, payload);
  }

  updateBranch(payload, id) {
    return this.http.post<Response>(`${BRANCH_API}/${id}`, payload);
  }

  updateUserrequest(payload, id) {
    return this.http.post<Response>(
      `${UPDATE_USER_REQUEST_API}/${id}`,
      payload
    );
  }

  getNotificationList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(`${NOTIFICATION_API}`, { params });
  }

  deleteNotification(id) {
    return this.http.delete<Response>(`${NOTIFICATION_API}/${id}`);
  }

  getNotification(id) {
    return this.http.get<Response>(`${NOTIFICATION_API}/${id}`);
  }

  createNotification(payload) {
    return this.http.post<Response>(NOTIFICATION_API, payload);
  }

  updateNotification(payload, id) {
    return this.http.post<Response>(`${NOTIFICATION_API}/${id}`, payload);
  }

  getBannerList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(`${BANNER_API}`, { params });
  }

  deleteBanner(id) {
    return this.http.delete<Response>(`${BANNER_API}/${id}`);
  }

  getBanner(id) {
    return this.http.get<Response>(`${BANNER_API}/${id}`);
  }

  createBanner(payload) {
    return this.http.post<Response>(BANNER_API, payload);
  }

  updateBanner(payload, id) {
    return this.http.post<Response>(`${BANNER_API}/${id}`, payload);
  }

  getOfferList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(`${OFFER_API}`, { params });
  }

  deleteOffer(id) {
    return this.http.delete<Response>(`${OFFER_API}/${id}`);
  }

  getOffer(id) {
    return this.http.get<Response>(`${OFFER_API}/${id}`);
  }

  createOffer(payload) {
    return this.http.post<Response>(OFFER_API, payload);
  }

  updateOffer(payload, id) {
    return this.http.post<Response>(`${OFFER_API}/${id}`, payload);
  }

  getDepositPaymentMethodlist(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(`${DEPOSIT_PAYMENT_METHOD_API}`, { params });
  }

  deleteDepositPaymentMethod(id) {
    return this.http.delete<Response>(`${DEPOSIT_PAYMENT_METHOD_API}/${id}`);
  }

  getDepositPaymentMethod(id) {
    return this.http.get<Response>(`${DEPOSIT_PAYMENT_METHOD_API}/${id}`);
  }

  createDepositPaymentMethod(payload) {
    return this.http.post<Response>(DEPOSIT_PAYMENT_METHOD_API, payload);
  }

  updateDepositPaymentMethod(payload, id) {
    return this.http.post<Response>(
      `${DEPOSIT_PAYMENT_METHOD_API}/${id}`,
      payload
    );
  }

  createBankCalculaator(data) {
    return this.http.post<Response>(BANK_CALCULATOR_API, data);
  }

  updateBankCalculaator(id, data) {
    return this.http.post<Response>(`${BANK_CALCULATOR_API}/${id}`, data);
  }

  getBankCalculatorList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(BANK_CALCULATOR_API, { params });
  }

  deleteBankCalculator(id) {
    return this.http.delete<Response>(`${BANK_CALCULATOR_API}/${id}`);
  }

  getBankCalculator(id) {
    return this.http.get<Response>(`${BANK_CALCULATOR_API}/${id}`);
  }

  createPointCalculaator(data) {
    return this.http.post<Response>(POINT_CALCULATOR_API, data);
  }

  updatePointCalculaator(id, data) {
    return this.http.post<Response>(`${POINT_CALCULATOR_API}/${id}`, data);
  }

  getPointCalculatorList(page, pageSize, search) {
    let params = new HttpParams()
      .append('page', page + 1)
      .append('pageSize', pageSize);
    if (search) params = params.append('filterkey', search);
    return this.http.get<Response>(POINT_CALCULATOR_API, { params });
  }

  deletePointCalculator(id) {
    return this.http.delete<Response>(`${POINT_CALCULATOR_API}/${id}`);
  }

  getPointCalculator(id) {
    return this.http.get<Response>(`${POINT_CALCULATOR_API}/${id}`);
  }
}
