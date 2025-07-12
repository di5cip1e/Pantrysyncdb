import {
  ActivityCreate,
  AddPantryItemData,
  AddShoppingListItemData,
  BodyScanReceipt,
  BodyScanShoppingList,
  BulkUpdateProductsData,
  BulkUpdateProductsPayload,
  CheckAndCreateNotificationsData,
  CheckHealthData,
  CommunityProductRequest,
  ConsumePantryItemData,
  ConsumptionRequest,
  CreateCommunityProductData,
  CreateHouseholdData,
  CreateHouseholdRequest,
  CreateInvitationData,
  CreateProductInfoData,
  CreateShoppingListData,
  DeletePantryItemData,
  DeleteShoppingListData,
  DeleteShoppingListItemData,
  GetCommunityStatsData,
  GetEnhancedUpcInfoData,
  GetHouseholdActivitiesData,
  GetHouseholdMembersData,
  GetMyHouseholdData,
  GetNotificationPreferencesData,
  GetNotificationsData,
  GetPantryItemsData,
  GetProductInfoData,
  GetShoppingListItemsData,
  GetShoppingListsData,
  GetStapleSuggestionsData,
  GetStaplesData,
  GetStaplesStatsData,
  HandleStapleSuggestionData,
  InterpretCommandData,
  InterpretRequest,
  JoinHouseholdData,
  JoinHouseholdRequest,
  LogActivityData,
  LookupCommunityProductData,
  LookupUpcProductData,
  MarkNotificationReadData,
  NotificationPreferences,
  PantryItemRequest,
  PantryItemUpdateRequest,
  ProcessReceiptItemsData,
  ProcessShoppingListItemsData,
  ProductInfoRequest,
  ProductInfoUpdateRequest,
  ReceiptProcessRequest,
  ScanReceiptData,
  ScanShoppingListData,
  SearchCommunityProductsData,
  SearchProductsData,
  ShoppingListItemRequest,
  ShoppingListProcessRequest,
  ShoppingListRequest,
  StapleToggleRequest,
  TestSecretData,
  ToggleStapleStatusData,
  UPCLookupRequest,
  UpdateNotificationPreferencesData,
  UpdatePantryItemData,
  UpdateProductInfoData,
  UpdateShoppingListItemData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Reads and attempts to parse the Firebase secret.
   * @tags dbtn/module:test_secret
   * @name test_secret
   * @summary Test Secret
   * @request GET:/routes/test-secret
   */
  export namespace test_secret {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TestSecretData;
  }

  /**
   * @description Gets all members of a household.
   * @tags dbtn/module:members, dbtn/hasAuth
   * @name get_household_members
   * @summary Get Household Members
   * @request GET:/routes/households/{household_id}/members
   */
  export namespace get_household_members {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHouseholdMembersData;
  }

  /**
   * No description
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name create_household
   * @summary Create Household
   * @request POST:/routes/households
   */
  export namespace create_household {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateHouseholdRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateHouseholdData;
  }

  /**
   * No description
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name get_my_household
   * @summary Get My Household
   * @request GET:/routes/households/me
   */
  export namespace get_my_household {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMyHouseholdData;
  }

  /**
   * No description
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name create_invitation
   * @summary Create Invitation
   * @request POST:/routes/households/{household_id}/invitations
   */
  export namespace create_invitation {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CreateInvitationData;
  }

  /**
   * No description
   * @tags dbtn/module:household, dbtn/hasAuth
   * @name join_household
   * @summary Join Household
   * @request POST:/routes/households/join
   */
  export namespace join_household {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = JoinHouseholdRequest;
    export type RequestHeaders = {};
    export type ResponseBody = JoinHouseholdData;
  }

  /**
   * @description Get user's notification preferences.
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name get_notification_preferences
   * @summary Get Notification Preferences
   * @request GET:/routes/notifications/preferences
   */
  export namespace get_notification_preferences {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetNotificationPreferencesData;
  }

  /**
   * @description Update user's notification preferences.
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name update_notification_preferences
   * @summary Update Notification Preferences
   * @request PUT:/routes/notifications/preferences
   */
  export namespace update_notification_preferences {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = NotificationPreferences;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateNotificationPreferencesData;
  }

  /**
   * @description Get user's notifications.
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name get_notifications
   * @summary Get Notifications
   * @request GET:/routes/notifications
   */
  export namespace get_notifications {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetNotificationsData;
  }

  /**
   * @description Mark a notification as read.
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name mark_notification_read
   * @summary Mark Notification Read
   * @request POST:/routes/notifications/{notification_id}/mark-read
   */
  export namespace mark_notification_read {
    export type RequestParams = {
      /** Notification Id */
      notificationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MarkNotificationReadData;
  }

  /**
   * @description Check for low stock and expiry conditions and create notifications.
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name check_and_create_notifications
   * @summary Check And Create Notifications
   * @request POST:/routes/notifications/check
   */
  export namespace check_and_create_notifications {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckAndCreateNotificationsData;
  }

  /**
   * @description Search products by name, category, tags, etc.
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name search_products
   * @summary Search Products
   * @request GET:/routes/product-info/search
   */
  export namespace search_products {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Query
       * Search term
       */
      query?: string | null;
      /**
       * Category
       * Filter by category
       */
      category?: string | null;
      /**
       * Tags
       * Comma-separated tags to filter by
       */
      tags?: string | null;
      /**
       * Limit
       * Maximum results
       * @default 20
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SearchProductsData;
  }

  /**
   * @description Get enhanced product information by UPC.
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name get_product_info
   * @summary Get Product Info
   * @request GET:/routes/product-info/{upc}
   */
  export namespace get_product_info {
    export type RequestParams = {
      /** Upc */
      upc: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetProductInfoData;
  }

  /**
   * @description Create or update enhanced product information.
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name create_product_info
   * @summary Create Product Info
   * @request POST:/routes/product-info
   */
  export namespace create_product_info {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductInfoRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateProductInfoData;
  }

  /**
   * @description Update enhanced product information.
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name update_product_info
   * @summary Update Product Info
   * @request PUT:/routes/product-info/{product_id}
   */
  export namespace update_product_info {
    export type RequestParams = {
      /** Product Id */
      productId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ProductInfoUpdateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateProductInfoData;
  }

  /**
   * @description Batch update multiple products.
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name bulk_update_products
   * @summary Bulk Update Products
   * @request POST:/routes/product-info/bulk-update
   */
  export namespace bulk_update_products {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BulkUpdateProductsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = BulkUpdateProductsData;
  }

  /**
   * @description Get combined UPC lookup data + enhanced product information.
   * @tags dbtn/module:product_info, dbtn/hasAuth
   * @name get_enhanced_upc_info
   * @summary Get Enhanced Upc Info
   * @request GET:/routes/enhanced-upc/{upc}
   */
  export namespace get_enhanced_upc_info {
    export type RequestParams = {
      /** Upc */
      upc: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEnhancedUpcInfoData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name get_shopping_lists
   * @summary Get Shopping Lists
   * @request GET:/routes/shopping-lists
   */
  export namespace get_shopping_lists {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetShoppingListsData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name create_shopping_list
   * @summary Create Shopping List
   * @request POST:/routes/shopping-lists
   */
  export namespace create_shopping_list {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ShoppingListRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateShoppingListData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name delete_shopping_list
   * @summary Delete Shopping List
   * @request DELETE:/routes/shopping-lists/{list_id}
   */
  export namespace delete_shopping_list {
    export type RequestParams = {
      /** List Id */
      listId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteShoppingListData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name add_shopping_list_item
   * @summary Add Shopping List Item
   * @request POST:/routes/shopping-lists/{list_id}/items
   */
  export namespace add_shopping_list_item {
    export type RequestParams = {
      /** List Id */
      listId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ShoppingListItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AddShoppingListItemData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name get_shopping_list_items
   * @summary Get Shopping List Items
   * @request GET:/routes/shopping-lists/{list_id}/items
   */
  export namespace get_shopping_list_items {
    export type RequestParams = {
      /** List Id */
      listId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetShoppingListItemsData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name update_shopping_list_item
   * @summary Update Shopping List Item
   * @request PUT:/routes/shopping-lists/items/{item_id}
   */
  export namespace update_shopping_list_item {
    export type RequestParams = {
      /** Item Id */
      itemId: string;
    };
    export type RequestQuery = {
      /**
       * List Id
       * List ID
       */
      list_id: string;
    };
    export type RequestBody = ShoppingListItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateShoppingListItemData;
  }

  /**
   * No description
   * @tags dbtn/module:shopping_lists, dbtn/hasAuth
   * @name delete_shopping_list_item
   * @summary Delete Shopping List Item
   * @request DELETE:/routes/shopping-lists/items/{item_id}
   */
  export namespace delete_shopping_list_item {
    export type RequestParams = {
      /** Item Id */
      itemId: string;
    };
    export type RequestQuery = {
      /**
       * List Id
       * List ID
       */
      list_id: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteShoppingListItemData;
  }

  /**
   * @description Scan receipt image and extract items using Google Cloud Vision API
   * @tags dbtn/module:receipt_scanner, dbtn/hasAuth
   * @name scan_receipt
   * @summary Scan Receipt
   * @request POST:/routes/receipt-scanner/scan
   */
  export namespace scan_receipt {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyScanReceipt;
    export type RequestHeaders = {};
    export type ResponseBody = ScanReceiptData;
  }

  /**
   * @description Process extracted receipt items and optionally add to pantry
   * @tags dbtn/module:receipt_scanner, dbtn/hasAuth
   * @name process_receipt_items
   * @summary Process Receipt Items
   * @request POST:/routes/receipt-scanner/process
   */
  export namespace process_receipt_items {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReceiptProcessRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ProcessReceiptItemsData;
  }

  /**
   * @description Scan shopping list image and extract items using Google Cloud Vision API
   * @tags dbtn/module:shopping_list_scanner, dbtn/hasAuth
   * @name scan_shopping_list
   * @summary Scan Shopping List
   * @request POST:/routes/shopping-list-scanner/scan
   */
  export namespace scan_shopping_list {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyScanShoppingList;
    export type RequestHeaders = {};
    export type ResponseBody = ScanShoppingListData;
  }

  /**
   * @description Process extracted shopping list items and add to specified shopping list
   * @tags dbtn/module:shopping_list_scanner, dbtn/hasAuth
   * @name process_shopping_list_items
   * @summary Process Shopping List Items
   * @request POST:/routes/shopping-list-scanner/process
   */
  export namespace process_shopping_list_items {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ShoppingListProcessRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ProcessShoppingListItemsData;
  }

  /**
   * @description Look up product information using UPC/barcode. First checks community database, then falls back to Open Food Facts API.
   * @tags dbtn/module:upc, dbtn/hasAuth
   * @name lookup_upc_product
   * @summary Lookup Upc Product
   * @request POST:/routes/lookup-upc
   */
  export namespace lookup_upc_product {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UPCLookupRequest;
    export type RequestHeaders = {};
    export type ResponseBody = LookupUpcProductData;
  }

  /**
   * @description Look up a product in the community database by UPC.
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name lookup_community_product
   * @summary Lookup Community Product
   * @request GET:/routes/community-products/lookup/{upc}
   */
  export namespace lookup_community_product {
    export type RequestParams = {
      /** Upc */
      upc: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = LookupCommunityProductData;
  }

  /**
   * @description Add a new product to the community database.
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name create_community_product
   * @summary Create Community Product
   * @request POST:/routes/community-products
   */
  export namespace create_community_product {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CommunityProductRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateCommunityProductData;
  }

  /**
   * @description Search products in the community database.
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name search_community_products
   * @summary Search Community Products
   * @request GET:/routes/community-products/search
   */
  export namespace search_community_products {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Query
       * Search term
       */
      query?: string | null;
      /**
       * Category
       * Filter by category
       */
      category?: string | null;
      /**
       * Verified Only
       * Only return verified products
       * @default false
       */
      verified_only?: boolean;
      /**
       * Limit
       * Maximum results
       * @default 20
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SearchCommunityProductsData;
  }

  /**
   * @description Get statistics about the community product database.
   * @tags dbtn/module:community_products, dbtn/hasAuth
   * @name get_community_stats
   * @summary Get Community Stats
   * @request GET:/routes/community-products/stats
   */
  export namespace get_community_stats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCommunityStatsData;
  }

  /**
   * @description Interprets the user's voice command using the Deepseek chat model.
   * @tags dbtn/module:ai, dbtn/hasAuth
   * @name interpret_command
   * @summary Interpret Command
   * @request POST:/routes/interpret
   */
  export namespace interpret_command {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = InterpretRequest;
    export type RequestHeaders = {};
    export type ResponseBody = InterpretCommandData;
  }

  /**
   * @description Adds a new item to a household's pantry.
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name add_pantry_item
   * @summary Add Pantry Item
   * @request POST:/routes/households/{household_id}/pantry
   */
  export namespace add_pantry_item {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PantryItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AddPantryItemData;
  }

  /**
   * @description Gets all items from a household's pantry.
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name get_pantry_items
   * @summary Get Pantry Items
   * @request GET:/routes/households/{household_id}/pantry
   */
  export namespace get_pantry_items {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPantryItemsData;
  }

  /**
   * @description Updates an item in a household's pantry.
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name update_pantry_item
   * @summary Update Pantry Item
   * @request PUT:/routes/households/{household_id}/pantry/{item_id}
   */
  export namespace update_pantry_item {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
      /** Item Id */
      itemId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PantryItemUpdateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UpdatePantryItemData;
  }

  /**
   * @description Deletes an item from a household's pantry.
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name delete_pantry_item
   * @summary Delete Pantry Item
   * @request DELETE:/routes/households/{household_id}/pantry/{item_id}
   */
  export namespace delete_pantry_item {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
      /** Item Id */
      itemId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeletePantryItemData;
  }

  /**
   * @description Handle consumption of pantry items via voice commands with voice label matching.
   * @tags dbtn/module:pantry, dbtn/hasAuth
   * @name consume_pantry_item
   * @summary Consume Pantry Item
   * @request POST:/routes/households/{household_id}/pantry/consume
   */
  export namespace consume_pantry_item {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsumptionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ConsumePantryItemData;
  }

  /**
   * @description Gets all items marked as staples from a household's pantry.
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name get_staples
   * @summary Get Staples
   * @request GET:/routes/households/{household_id}/staples
   */
  export namespace get_staples {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStaplesData;
  }

  /**
   * @description Toggle the staple status of a pantry item.
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name toggle_staple_status
   * @summary Toggle Staple Status
   * @request PUT:/routes/households/{household_id}/pantry/{item_id}/staple
   */
  export namespace toggle_staple_status {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
      /** Item Id */
      itemId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = StapleToggleRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ToggleStapleStatusData;
  }

  /**
   * @description Get statistics about staples in the household.
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name get_staples_stats
   * @summary Get Staples Stats
   * @request GET:/routes/households/{household_id}/staples/stats
   */
  export namespace get_staples_stats {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStaplesStatsData;
  }

  /**
   * @description Get AI-powered suggestions for items that should be marked as staples.
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name get_staple_suggestions
   * @summary Get Staple Suggestions
   * @request GET:/routes/households/{household_id}/staples/suggestions
   */
  export namespace get_staple_suggestions {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStapleSuggestionsData;
  }

  /**
   * @description Handle acceptance or dismissal of a staple suggestion.
   * @tags dbtn/module:staples, dbtn/hasAuth
   * @name handle_staple_suggestion
   * @summary Handle Staple Suggestion
   * @request POST:/routes/households/{household_id}/staples/suggestions/{item_id}/{action}
   */
  export namespace handle_staple_suggestion {
    export type RequestParams = {
      /** Household Id */
      householdId: string;
      /** Item Id */
      itemId: string;
      /** Action */
      action: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandleStapleSuggestionData;
  }

  /**
   * @description Log an activity for the user's household
   * @tags dbtn/module:activities, dbtn/hasAuth
   * @name log_activity
   * @summary Log Activity
   * @request POST:/routes/activities
   */
  export namespace log_activity {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ActivityCreate;
    export type RequestHeaders = {};
    export type ResponseBody = LogActivityData;
  }

  /**
   * @description Get recent activities for the user's household
   * @tags dbtn/module:activities, dbtn/hasAuth
   * @name get_household_activities
   * @summary Get Household Activities
   * @request GET:/routes/activities
   */
  export namespace get_household_activities {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHouseholdActivitiesData;
  }
}
