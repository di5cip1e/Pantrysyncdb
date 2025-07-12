import {
  ActivityCreate,
  AddPantryItemData,
  AddPantryItemError,
  AddPantryItemParams,
  AddShoppingListItemData,
  AddShoppingListItemError,
  AddShoppingListItemParams,
  BodyScanReceipt,
  BodyScanShoppingList,
  BulkUpdateProductsData,
  BulkUpdateProductsError,
  BulkUpdateProductsPayload,
  CheckAndCreateNotificationsData,
  CheckHealthData,
  CommunityProductRequest,
  ConsumePantryItemData,
  ConsumePantryItemError,
  ConsumePantryItemParams,
  ConsumptionRequest,
  CreateCommunityProductData,
  CreateCommunityProductError,
  CreateHouseholdData,
  CreateHouseholdError,
  CreateHouseholdRequest,
  CreateInvitationData,
  CreateInvitationError,
  CreateInvitationParams,
  CreateProductInfoData,
  CreateProductInfoError,
  CreateShoppingListData,
  CreateShoppingListError,
  DeletePantryItemData,
  DeletePantryItemError,
  DeletePantryItemParams,
  DeleteShoppingListData,
  DeleteShoppingListError,
  DeleteShoppingListItemData,
  DeleteShoppingListItemError,
  DeleteShoppingListItemParams,
  DeleteShoppingListParams,
  GetCommunityStatsData,
  GetEnhancedUpcInfoData,
  GetEnhancedUpcInfoError,
  GetEnhancedUpcInfoParams,
  GetHouseholdActivitiesData,
  GetHouseholdActivitiesError,
  GetHouseholdActivitiesParams,
  GetHouseholdMembersData,
  GetHouseholdMembersError,
  GetHouseholdMembersParams,
  GetMyHouseholdData,
  GetNotificationPreferencesData,
  GetNotificationsData,
  GetNotificationsError,
  GetNotificationsParams,
  GetPantryItemsData,
  GetPantryItemsError,
  GetPantryItemsParams,
  GetProductInfoData,
  GetProductInfoError,
  GetProductInfoParams,
  GetShoppingListItemsData,
  GetShoppingListItemsError,
  GetShoppingListItemsParams,
  GetShoppingListsData,
  GetStapleSuggestionsData,
  GetStapleSuggestionsError,
  GetStapleSuggestionsParams,
  GetStaplesData,
  GetStaplesError,
  GetStaplesParams,
  GetStaplesStatsData,
  GetStaplesStatsError,
  GetStaplesStatsParams,
  HandleStapleSuggestionData,
  HandleStapleSuggestionError,
  HandleStapleSuggestionParams,
  InterpretCommandData,
  InterpretCommandError,
  InterpretRequest,
  JoinHouseholdData,
  JoinHouseholdError,
  JoinHouseholdRequest,
  LogActivityData,
  LogActivityError,
  LookupCommunityProductData,
  LookupCommunityProductError,
  LookupCommunityProductParams,
  LookupUpcProductData,
  LookupUpcProductError,
  MarkNotificationReadData,
  MarkNotificationReadError,
  MarkNotificationReadParams,
  NotificationPreferences,
  PantryItemRequest,
  PantryItemUpdateRequest,
  ProcessReceiptItemsData,
  ProcessReceiptItemsError,
  ProcessShoppingListItemsData,
  ProcessShoppingListItemsError,
  ProductInfoRequest,
  ProductInfoUpdateRequest,
  ReceiptProcessRequest,
  ScanReceiptData,
  ScanReceiptError,
  ScanShoppingListData,
  ScanShoppingListError,
  SearchCommunityProductsData,
  SearchCommunityProductsError,
  SearchCommunityProductsParams,
  SearchProductsData,
  SearchProductsError,
  SearchProductsParams,
  ShoppingListItemRequest,
  ShoppingListProcessRequest,
  ShoppingListRequest,
  StapleToggleRequest,
  TestSecretData,
  ToggleStapleStatusData,
  ToggleStapleStatusError,
  ToggleStapleStatusParams,
  UPCLookupRequest,
  UpdateNotificationPreferencesData,
  UpdateNotificationPreferencesError,
  UpdatePantryItemData,
  UpdatePantryItemError,
  UpdatePantryItemParams,
  UpdateProductInfoData,
  UpdateProductInfoError,
  UpdateProductInfoParams,
  UpdateShoppingListItemData,
  UpdateShoppingListItemError,
  UpdateShoppingListItemParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Reads and attempts to parse the Firebase secret.
   *
   * @tags dbtn/module:test_secret
   * @name test_secret
   * @summary Test Secret
   * @request GET:/routes/test-secret
   */
  test_secret = (params: RequestParams = {}) =>
    this.request<TestSecretData, any>({
      path: `/routes/test-secret`,
      method: "GET",
      ...params,
    });

  /**
   * @description Gets all members of a household.
   *
   * @tags dbtn/module:members, dbtn/hasAuth
   * @name get_household_members
   * @summary Get Household Members
   * @request GET:/routes/households/{household_id}/members
   */
  get_household_members = ({ householdId, ...query }: GetHouseholdMembersParams, params: RequestParams = {}) =>
    this.request<GetHouseholdMembersData, GetHouseholdMembersError>({
      path: `/routes/households/${householdId}/members`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name create_household
   * @summary Create Household
   * @request POST:/routes/households
   */
  create_household = (data: CreateHouseholdRequest, params: RequestParams = {}) =>
    this.request<CreateHouseholdData, CreateHouseholdError>({
      path: `/routes/households`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name get_my_household
   * @summary Get My Household
   * @request GET:/routes/households/me
   */
  get_my_household = (params: RequestParams = {}) =>
    this.request<GetMyHouseholdData, any>({
      path: `/routes/households/me`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name create_invitation
   * @summary Create Invitation
   * @request POST:/routes/households/{household_id}/invitations
   */
  create_invitation = ({ householdId, ...query }: CreateInvitationParams, params: RequestParams = {}) =>
    this.request<CreateInvitationData, CreateInvitationError>({
      path: `/routes/households/${householdId}/invitations`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name join_household
   * @summary Join Household
   * @request POST:/routes/households/join
   */
  join_household = (data: JoinHouseholdRequest, params: RequestParams = {}) =>
    this.request<JoinHouseholdData, JoinHouseholdError>({
      path: `/routes/households/join`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get user's notification preferences.
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name get_notification_preferences
   * @summary Get Notification Preferences
   * @request GET:/routes/notifications/preferences
   */
  get_notification_preferences = (params: RequestParams = {}) =>
    this.request<GetNotificationPreferencesData, any>({
      path: `/routes/notifications/preferences`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update user's notification preferences.
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name update_notification_preferences
   * @summary Update Notification Preferences
   * @request PUT:/routes/notifications/preferences
   */
  update_notification_preferences = (data: NotificationPreferences, params: RequestParams = {}) =>
    this.request<UpdateNotificationPreferencesData, UpdateNotificationPreferencesError>({
      path: `/routes/notifications/preferences`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get user's notifications.
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name get_notifications
   * @summary Get Notifications
   * @request GET:/routes/notifications
   */
  get_notifications = (query: GetNotificationsParams, params: RequestParams = {}) =>
    this.request<GetNotificationsData, GetNotificationsError>({
      path: `/routes/notifications`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Mark a notification as read.
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name mark_notification_read
   * @summary Mark Notification Read
   * @request POST:/routes/notifications/{notification_id}/mark-read
   */
  mark_notification_read = ({ notificationId, ...query }: MarkNotificationReadParams, params: RequestParams = {}) =>
    this.request<MarkNotificationReadData, MarkNotificationReadError>({
      path: `/routes/notifications/${notificationId}/mark-read`,
      method: "POST",
      ...params,
    });

  /**
   * @description Check for low stock and expiry conditions and create notifications.
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name check_and_create_notifications
   * @summary Check And Create Notifications
   * @request POST:/routes/notifications/check
   */
  check_and_create_notifications = (params: RequestParams = {}) =>
    this.request<CheckAndCreateNotificationsData, any>({
      path: `/routes/notifications/check`,
      method: "POST",
      ...params,
    });

  /**
   * @description Search products by name, category, tags, etc.
   *
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name search_products
   * @summary Search Products
   * @request GET:/routes/product-info/search
   */
  search_products = (query: SearchProductsParams, params: RequestParams = {}) =>
    this.request<SearchProductsData, SearchProductsError>({
      path: `/routes/product-info/search`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get enhanced product information by UPC.
   *
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name get_product_info
   * @summary Get Product Info
   * @request GET:/routes/product-info/{upc}
   */
  get_product_info = ({ upc, ...query }: GetProductInfoParams, params: RequestParams = {}) =>
    this.request<GetProductInfoData, GetProductInfoError>({
      path: `/routes/product-info/${upc}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Create or update enhanced product information.
   *
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name create_product_info
   * @summary Create Product Info
   * @request POST:/routes/product-info
   */
  create_product_info = (data: ProductInfoRequest, params: RequestParams = {}) =>
    this.request<CreateProductInfoData, CreateProductInfoError>({
      path: `/routes/product-info`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Update enhanced product information.
   *
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name update_product_info
   * @summary Update Product Info
   * @request PUT:/routes/product-info/{product_id}
   */
  update_product_info = (
    { productId, ...query }: UpdateProductInfoParams,
    data: ProductInfoUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<UpdateProductInfoData, UpdateProductInfoError>({
      path: `/routes/product-info/${productId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Batch update multiple products.
   *
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name bulk_update_products
   * @summary Bulk Update Products
   * @request POST:/routes/product-info/bulk-update
   */
  bulk_update_products = (data: BulkUpdateProductsPayload, params: RequestParams = {}) =>
    this.request<BulkUpdateProductsData, BulkUpdateProductsError>({
      path: `/routes/product-info/bulk-update`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get combined UPC lookup data + enhanced product information.
   *
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name get_enhanced_upc_info
   * @summary Get Enhanced Upc Info
   * @request GET:/routes/enhanced-upc/{upc}
   */
  get_enhanced_upc_info = ({ upc, ...query }: GetEnhancedUpcInfoParams, params: RequestParams = {}) =>
    this.request<GetEnhancedUpcInfoData, GetEnhancedUpcInfoError>({
      path: `/routes/enhanced-upc/${upc}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name get_shopping_lists
   * @summary Get Shopping Lists
   * @request GET:/routes/shopping-lists
   */
  get_shopping_lists = (params: RequestParams = {}) =>
    this.request<GetShoppingListsData, any>({
      path: `/routes/shopping-lists`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name create_shopping_list
   * @summary Create Shopping List
   * @request POST:/routes/shopping-lists
   */
  create_shopping_list = (data: ShoppingListRequest, params: RequestParams = {}) =>
    this.request<CreateShoppingListData, CreateShoppingListError>({
      path: `/routes/shopping-lists`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name delete_shopping_list
   * @summary Delete Shopping List
   * @request DELETE:/routes/shopping-lists/{list_id}
   */
  delete_shopping_list = ({ listId, ...query }: DeleteShoppingListParams, params: RequestParams = {}) =>
    this.request<DeleteShoppingListData, DeleteShoppingListError>({
      path: `/routes/shopping-lists/${listId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name add_shopping_list_item
   * @summary Add Shopping List Item
   * @request POST:/routes/shopping-lists/{list_id}/items
   */
  add_shopping_list_item = (
    { listId, ...query }: AddShoppingListItemParams,
    data: ShoppingListItemRequest,
    params: RequestParams = {},
  ) =>
    this.request<AddShoppingListItemData, AddShoppingListItemError>({
      path: `/routes/shopping-lists/${listId}/items`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name get_shopping_list_items
   * @summary Get Shopping List Items
   * @request GET:/routes/shopping-lists/{list_id}/items
   */
  get_shopping_list_items = ({ listId, ...query }: GetShoppingListItemsParams, params: RequestParams = {}) =>
    this.request<GetShoppingListItemsData, GetShoppingListItemsError>({
      path: `/routes/shopping-lists/${listId}/items`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name update_shopping_list_item
   * @summary Update Shopping List Item
   * @request PUT:/routes/shopping-lists/items/{item_id}
   */
  update_shopping_list_item = (
    { itemId, ...query }: UpdateShoppingListItemParams,
    data: ShoppingListItemRequest,
    params: RequestParams = {},
  ) =>
    this.request<UpdateShoppingListItemData, UpdateShoppingListItemError>({
      path: `/routes/shopping-lists/items/${itemId}`,
      method: "PUT",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name delete_shopping_list_item
   * @summary Delete Shopping List Item
   * @request DELETE:/routes/shopping-lists/items/{item_id}
   */
  delete_shopping_list_item = ({ itemId, ...query }: DeleteShoppingListItemParams, params: RequestParams = {}) =>
    this.request<DeleteShoppingListItemData, DeleteShoppingListItemError>({
      path: `/routes/shopping-lists/items/${itemId}`,
      method: "DELETE",
      query: query,
      ...params,
    });

  /**
   * @description Scan receipt image and extract items using Google Cloud Vision API
   *
   * @tags dbtn/module:receipt_scanner, dbtn/hasAuth
   * @name scan_receipt
   * @summary Scan Receipt
   * @request POST:/routes/receipt-scanner/scan
   */
  scan_receipt = (data: BodyScanReceipt, params: RequestParams = {}) =>
    this.request<ScanReceiptData, ScanReceiptError>({
      path: `/routes/receipt-scanner/scan`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Process extracted receipt items and optionally add to pantry
   *
   * @tags dbtn/module:receipt_scanner, dbtn/hasAuth
   * @name process_receipt_items
   * @summary Process Receipt Items
   * @request POST:/routes/receipt-scanner/process
   */
  process_receipt_items = (data: ReceiptProcessRequest, params: RequestParams = {}) =>
    this.request<ProcessReceiptItemsData, ProcessReceiptItemsError>({
      path: `/routes/receipt-scanner/process`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Scan shopping list image and extract items using Google Cloud Vision API
   *
   * @tags dbtn/module:shopping_list_scanner, dbtn/hasAuth
   * @name scan_shopping_list
   * @summary Scan Shopping List
   * @request POST:/routes/shopping-list-scanner/scan
   */
  scan_shopping_list = (data: BodyScanShoppingList, params: RequestParams = {}) =>
    this.request<ScanShoppingListData, ScanShoppingListError>({
      path: `/routes/shopping-list-scanner/scan`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Process extracted shopping list items and add to specified shopping list
   *
   * @tags dbtn/module:shopping_list_scanner, dbtn/hasAuth
   * @name process_shopping_list_items
   * @summary Process Shopping List Items
   * @request POST:/routes/shopping-list-scanner/process
   */
  process_shopping_list_items = (data: ShoppingListProcessRequest, params: RequestParams = {}) =>
    this.request<ProcessShoppingListItemsData, ProcessShoppingListItemsError>({
      path: `/routes/shopping-list-scanner/process`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Look up product information using UPC/barcode. First checks community database, then falls back to Open Food Facts API.
   *
   * @tags dbtn/module:upc, dbtn/hasAuth
   * @name lookup_upc_product
   * @summary Lookup Upc Product
   * @request POST:/routes/lookup-upc
   */
  lookup_upc_product = (data: UPCLookupRequest, params: RequestParams = {}) =>
    this.request<LookupUpcProductData, LookupUpcProductError>({
      path: `/routes/lookup-upc`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Look up a product in the community database by UPC.
   *
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name lookup_community_product
   * @summary Lookup Community Product
   * @request GET:/routes/community-products/lookup/{upc}
   */
  lookup_community_product = ({ upc, ...query }: LookupCommunityProductParams, params: RequestParams = {}) =>
    this.request<LookupCommunityProductData, LookupCommunityProductError>({
      path: `/routes/community-products/lookup/${upc}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Add a new product to the community database.
   *
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name create_community_product
   * @summary Create Community Product
   * @request POST:/routes/community-products
   */
  create_community_product = (data: CommunityProductRequest, params: RequestParams = {}) =>
    this.request<CreateCommunityProductData, CreateCommunityProductError>({
      path: `/routes/community-products`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Search products in the community database.
   *
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name search_community_products
   * @summary Search Community Products
   * @request GET:/routes/community-products/search
   */
  search_community_products = (query: SearchCommunityProductsParams, params: RequestParams = {}) =>
    this.request<SearchCommunityProductsData, SearchCommunityProductsError>({
      path: `/routes/community-products/search`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get statistics about the community product database.
   *
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name get_community_stats
   * @summary Get Community Stats
   * @request GET:/routes/community-products/stats
   */
  get_community_stats = (params: RequestParams = {}) =>
    this.request<GetCommunityStatsData, any>({
      path: `/routes/community-products/stats`,
      method: "GET",
      ...params,
    });

  /**
   * @description Interprets the user's voice command using the Deepseek chat model.
   *
   * @tags dbtn/module:ai, dbtn/hasAuth
   * @name interpret_command
   * @summary Interpret Command
   * @request POST:/routes/interpret
   */
  interpret_command = (data: InterpretRequest, params: RequestParams = {}) =>
    this.request<InterpretCommandData, InterpretCommandError>({
      path: `/routes/interpret`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Adds a new item to a household's pantry.
   *
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name add_pantry_item
   * @summary Add Pantry Item
   * @request POST:/routes/households/{household_id}/pantry
   */
  add_pantry_item = (
    { householdId, ...query }: AddPantryItemParams,
    data: PantryItemRequest,
    params: RequestParams = {},
  ) =>
    this.request<AddPantryItemData, AddPantryItemError>({
      path: `/routes/households/${householdId}/pantry`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Gets all items from a household's pantry.
   *
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name get_pantry_items
   * @summary Get Pantry Items
   * @request GET:/routes/households/{household_id}/pantry
   */
  get_pantry_items = ({ householdId, ...query }: GetPantryItemsParams, params: RequestParams = {}) =>
    this.request<GetPantryItemsData, GetPantryItemsError>({
      path: `/routes/households/${householdId}/pantry`,
      method: "GET",
      ...params,
    });

  /**
   * @description Updates an item in a household's pantry.
   *
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name update_pantry_item
   * @summary Update Pantry Item
   * @request PUT:/routes/households/{household_id}/pantry/{item_id}
   */
  update_pantry_item = (
    { householdId, itemId, ...query }: UpdatePantryItemParams,
    data: PantryItemUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<UpdatePantryItemData, UpdatePantryItemError>({
      path: `/routes/households/${householdId}/pantry/${itemId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Deletes an item from a household's pantry.
   *
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name delete_pantry_item
   * @summary Delete Pantry Item
   * @request DELETE:/routes/households/{household_id}/pantry/{item_id}
   */
  delete_pantry_item = ({ householdId, itemId, ...query }: DeletePantryItemParams, params: RequestParams = {}) =>
    this.request<DeletePantryItemData, DeletePantryItemError>({
      path: `/routes/households/${householdId}/pantry/${itemId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Handle consumption of pantry items via voice commands with voice label matching.
   *
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name consume_pantry_item
   * @summary Consume Pantry Item
   * @request POST:/routes/households/{household_id}/pantry/consume
   */
  consume_pantry_item = (
    { householdId, ...query }: ConsumePantryItemParams,
    data: ConsumptionRequest,
    params: RequestParams = {},
  ) =>
    this.request<ConsumePantryItemData, ConsumePantryItemError>({
      path: `/routes/households/${householdId}/pantry/consume`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Gets all items marked as staples from a household's pantry.
   *
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name get_staples
   * @summary Get Staples
   * @request GET:/routes/households/{household_id}/staples
   */
  get_staples = ({ householdId, ...query }: GetStaplesParams, params: RequestParams = {}) =>
    this.request<GetStaplesData, GetStaplesError>({
      path: `/routes/households/${householdId}/staples`,
      method: "GET",
      ...params,
    });

  /**
   * @description Toggle the staple status of a pantry item.
   *
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name toggle_staple_status
   * @summary Toggle Staple Status
   * @request PUT:/routes/households/{household_id}/pantry/{item_id}/staple
   */
  toggle_staple_status = (
    { householdId, itemId, ...query }: ToggleStapleStatusParams,
    data: StapleToggleRequest,
    params: RequestParams = {},
  ) =>
    this.request<ToggleStapleStatusData, ToggleStapleStatusError>({
      path: `/routes/households/${householdId}/pantry/${itemId}/staple`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get statistics about staples in the household.
   *
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name get_staples_stats
   * @summary Get Staples Stats
   * @request GET:/routes/households/{household_id}/staples/stats
   */
  get_staples_stats = ({ householdId, ...query }: GetStaplesStatsParams, params: RequestParams = {}) =>
    this.request<GetStaplesStatsData, GetStaplesStatsError>({
      path: `/routes/households/${householdId}/staples/stats`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get AI-powered suggestions for items that should be marked as staples.
   *
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name get_staple_suggestions
   * @summary Get Staple Suggestions
   * @request GET:/routes/households/{household_id}/staples/suggestions
   */
  get_staple_suggestions = ({ householdId, ...query }: GetStapleSuggestionsParams, params: RequestParams = {}) =>
    this.request<GetStapleSuggestionsData, GetStapleSuggestionsError>({
      path: `/routes/households/${householdId}/staples/suggestions`,
      method: "GET",
      ...params,
    });

  /**
   * @description Handle acceptance or dismissal of a staple suggestion.
   *
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name handle_staple_suggestion
   * @summary Handle Staple Suggestion
   * @request POST:/routes/households/{household_id}/staples/suggestions/{item_id}/{action}
   */
  handle_staple_suggestion = (
    { householdId, itemId, action, ...query }: HandleStapleSuggestionParams,
    params: RequestParams = {},
  ) =>
    this.request<HandleStapleSuggestionData, HandleStapleSuggestionError>({
      path: `/routes/households/${householdId}/staples/suggestions/${itemId}/${action}`,
      method: "POST",
      ...params,
    });

  /**
   * @description Log an activity for the user's household
   *
   * @tags dbtn/module:activities, dbtn/hasAuth
   * @name log_activity
   * @summary Log Activity
   * @request POST:/routes/activities
   */
  log_activity = (data: ActivityCreate, params: RequestParams = {}) =>
    this.request<LogActivityData, LogActivityError>({
      path: `/routes/activities`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get recent activities for the user's household
   *
   * @tags dbtn/module:activities, dbtn/hasAuth
   * @name get_household_activities
   * @summary Get Household Activities
   * @request GET:/routes/activities
   */
  get_household_activities = (query: GetHouseholdActivitiesParams, params: RequestParams = {}) =>
    this.request<GetHouseholdActivitiesData, GetHouseholdActivitiesError>({
      path: `/routes/activities`,
      method: "GET",
      query: query,
      ...params,
    });
}
