/** ActivityCreate */
export interface ActivityCreate {
  /** Action Type */
  action_type: string;
  /** Action Description */
  action_description: string;
  /** Entity Type */
  entity_type: string;
  /** Entity Id */
  entity_id?: string | null;
  /** Entity Name */
  entity_name?: string | null;
  /** Metadata */
  metadata?: Record<string, any> | null;
}

/** ActivityResponse */
export interface ActivityResponse {
  /** Id */
  id: string;
  /** Household Id */
  household_id: string;
  /** User Id */
  user_id: string;
  /** User Name */
  user_name: string;
  /** Action Type */
  action_type: string;
  /** Action Description */
  action_description: string;
  /** Entity Type */
  entity_type: string;
  /** Entity Id */
  entity_id: string | null;
  /** Entity Name */
  entity_name: string | null;
  /** Metadata */
  metadata: Record<string, any> | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** Body_scan_receipt */
export interface BodyScanReceipt {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** Body_scan_shopping_list */
export interface BodyScanShoppingList {
  /**
   * File
   * @format binary
   */
  file: File;
}

/**
 * CommunityProductLookupResponse
 * Response for community UPC lookup
 */
export interface CommunityProductLookupResponse {
  /** Upc */
  upc: string;
  /** Found */
  found: boolean;
  product?: CommunityProductResponse | null;
  /** Message */
  message: string;
}

/** CommunityProductRequest */
export interface CommunityProductRequest {
  /**
   * Upc
   * 12-digit UPC identifier
   */
  upc: string;
  /**
   * Name
   * Product name as entered by user
   */
  name: string;
  /**
   * Brand
   * Brand name if known
   */
  brand?: string | null;
  /**
   * Category
   * General category (produce, dairy, pantry, etc.)
   */
  category?: string | null;
  /**
   * Description
   * Additional details about the product
   */
  description?: string | null;
  /**
   * Image Url
   * URL to product image if available
   */
  image_url?: string | null;
}

/** CommunityProductResponse */
export interface CommunityProductResponse {
  /** Id */
  id: string;
  /** Upc */
  upc: string;
  /** Name */
  name: string;
  /** Brand */
  brand?: string | null;
  /** Category */
  category?: string | null;
  /** Description */
  description?: string | null;
  /** Image Url */
  image_url?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Created By */
  created_by: string;
  /**
   * Contributor Count
   * Number of users who contributed this product
   * @default 1
   */
  contributor_count?: number;
  /**
   * Verified
   * Whether this entry has been verified by multiple users
   * @default false
   */
  verified?: boolean;
}

/** ConsumptionRequest */
export interface ConsumptionRequest {
  /** Item Name */
  item_name: string;
  /**
   * Quantity Used
   * @default 1
   */
  quantity_used?: number;
  /**
   * Consumed Completely
   * @default false
   */
  consumed_completely?: boolean;
}

/** ConsumptionResponse */
export interface ConsumptionResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  updated_item?: PantryItemResponse | null;
  /**
   * Matched By Voice Label
   * @default false
   */
  matched_by_voice_label?: boolean;
}

/** CreateHouseholdRequest */
export interface CreateHouseholdRequest {
  /** Name */
  name: string;
}

/**
 * EnhancedUPCResponse
 * Combined response with basic UPC data + enhanced product info
 */
export interface EnhancedUPCResponse {
  /** Upc */
  upc: string;
  /**
   * Basic Product Info
   * Data from UPC lookup API
   */
  basic_product_info: Record<string, any>;
  /** Our enhanced metadata */
  enhanced_product_info?: ProductInfoResponse | null;
  /**
   * Has Enhancement
   * Whether we have enhanced data for this UPC
   */
  has_enhancement: boolean;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** HouseholdMember */
export interface HouseholdMember {
  /** Id */
  id: string;
  /** Role */
  role: string;
  /** Joined At */
  joined_at: string;
}

/** HouseholdResponse */
export interface HouseholdResponse {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Role */
  role: string;
}

/** InterpretRequest */
export interface InterpretRequest {
  /** Text */
  text: string;
}

/** InterpretResponse */
export interface InterpretResponse {
  /** Action */
  action: string;
  /** Payload */
  payload: Record<string, any>;
}

/** InvitationResponse */
export interface InvitationResponse {
  /** Invite Code */
  invite_code: string;
}

/** JoinHouseholdRequest */
export interface JoinHouseholdRequest {
  /** Invite Code */
  invite_code: string;
}

/** NotificationPreferences */
export interface NotificationPreferences {
  /**
   * Low Stock Enabled
   * @default true
   */
  low_stock_enabled?: boolean;
  /**
   * Low Stock Threshold
   * @min 1
   * @max 100
   * @default 3
   */
  low_stock_threshold?: number;
  /**
   * Expiry Enabled
   * @default true
   */
  expiry_enabled?: boolean;
  /**
   * Expiry Days Ahead
   * @min 1
   * @max 30
   * @default 3
   */
  expiry_days_ahead?: number;
}

/** NotificationResponse */
export interface NotificationResponse {
  /** Id */
  id: string;
  /** Type */
  type: string;
  /** Title */
  title: string;
  /** Message */
  message: string;
  /** Item Id */
  item_id: string;
  /** Item Name */
  item_name: string;
  /** Household Id */
  household_id: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Is Read
   * @default false
   */
  is_read?: boolean;
  /** Metadata */
  metadata?: Record<string, any> | null;
}

/** PantryItemRequest */
export interface PantryItemRequest {
  /** Name */
  name: string;
  /** Quantity */
  quantity: number;
  /** Expiry Date */
  expiry_date?: string | null;
  /**
   * Is Staple
   * Whether this item is marked as a household staple
   * @default false
   */
  is_staple?: boolean | null;
  /**
   * Voice Labels
   * Custom voice aliases for this item
   */
  voice_labels?: string[] | null;
  /**
   * Display Name
   * Custom display name for this item
   */
  display_name?: string | null;
}

/** PantryItemResponse */
export interface PantryItemResponse {
  /** Name */
  name: string;
  /** Quantity */
  quantity: number;
  /** Expiry Date */
  expiry_date?: string | null;
  /**
   * Is Staple
   * Whether this item is marked as a household staple
   * @default false
   */
  is_staple?: boolean | null;
  /**
   * Voice Labels
   * Custom voice aliases for this item
   */
  voice_labels?: string[] | null;
  /**
   * Display Name
   * Custom display name for this item
   */
  display_name?: string | null;
  /** Id */
  id: string;
  /** Added By */
  added_by: string;
  /**
   * Added At
   * @format date-time
   */
  added_at: string;
  /**
   * Usage Count
   * Number of times this item has been consumed
   * @default 0
   */
  usage_count?: number | null;
  /**
   * Last Used
   * When this item was last consumed
   */
  last_used?: string | null;
  /**
   * Times Suggested As Staple
   * How many times we've suggested this as staple
   * @default 0
   */
  times_suggested_as_staple?: number | null;
}

/** PantryItemUpdateRequest */
export interface PantryItemUpdateRequest {
  /** Name */
  name?: string | null;
  /** Quantity */
  quantity?: number | null;
  /** Expiry Date */
  expiry_date?: string | null;
  /** Is Staple */
  is_staple?: boolean | null;
  /** Voice Labels */
  voice_labels?: string[] | null;
  /** Display Name */
  display_name?: string | null;
  /** Usage Count */
  usage_count?: number | null;
  /** Last Used */
  last_used?: string | null;
  /** Times Suggested As Staple */
  times_suggested_as_staple?: number | null;
}

/** ProductInfo */
export interface ProductInfo {
  /** Name */
  name: string;
  /** Brand */
  brand?: string | null;
  /** Category */
  category?: string | null;
  /** Image Url */
  image_url?: string | null;
  /** Ingredients */
  ingredients?: string | null;
  /** Nutrition Grade */
  nutrition_grade?: string | null;
  /**
   * Found
   * @default true
   */
  found?: boolean;
  /**
   * Source
   * @default "external"
   */
  source?: string;
}

/** ProductInfoRequest */
export interface ProductInfoRequest {
  /**
   * Upc
   * 12-digit UPC identifier
   */
  upc: string;
  /**
   * Base Name
   * Product name from UPC lookup API
   */
  base_name: string;
  /**
   * Enhanced Name
   * Our improved/cleaned product name
   */
  enhanced_name?: string | null;
  /**
   * Category
   * Standardized category (produce, dairy, pantry, etc.)
   */
  category?: string | null;
  /**
   * Subcategory
   * More specific classification
   */
  subcategory?: string | null;
  /**
   * Tags
   * Searchable tags (organic, gluten-free, spicy, etc.)
   * @default []
   */
  tags?: string[];
  /**
   * Common Aliases
   * Alternative names people might use
   * @default []
   */
  common_aliases?: string[];
  /**
   * Storage Tips
   * How to store this product
   */
  storage_tips?: string | null;
  /**
   * Typical Shelf Life
   * Estimated days until expiry
   */
  typical_shelf_life?: number | null;
  /**
   * Nutritional Highlights
   * Key nutrition facts
   * @default []
   */
  nutritional_highlights?: string[];
  /**
   * Recipe Categories
   * What types of recipes this works for
   * @default []
   */
  recipe_categories?: string[];
  /**
   * Seasonal Availability
   * When this product is typically available
   */
  seasonal_availability?: string | null;
  /**
   * Price Range
   * Typical price range for budgeting
   */
  price_range?: Record<string, number> | null;
  /**
   * Confidence Score
   * How confident we are in this data
   * @default 0.5
   */
  confidence_score?: number;
}

/** ProductInfoResponse */
export interface ProductInfoResponse {
  /** Id */
  id: string;
  /** Upc */
  upc: string;
  /** Base Name */
  base_name: string;
  /** Enhanced Name */
  enhanced_name?: string | null;
  /** Category */
  category?: string | null;
  /** Subcategory */
  subcategory?: string | null;
  /**
   * Tags
   * @default []
   */
  tags?: string[];
  /**
   * Common Aliases
   * @default []
   */
  common_aliases?: string[];
  /** Storage Tips */
  storage_tips?: string | null;
  /** Typical Shelf Life */
  typical_shelf_life?: number | null;
  /**
   * Nutritional Highlights
   * @default []
   */
  nutritional_highlights?: string[];
  /**
   * Recipe Categories
   * @default []
   */
  recipe_categories?: string[];
  /** Seasonal Availability */
  seasonal_availability?: string | null;
  /** Price Range */
  price_range?: Record<string, number> | null;
  /**
   * Confidence Score
   * @default 0.5
   */
  confidence_score?: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** Created By */
  created_by: string;
  /** Updated By */
  updated_by: string;
}

/** ProductInfoUpdateRequest */
export interface ProductInfoUpdateRequest {
  /** Enhanced Name */
  enhanced_name?: string | null;
  /** Category */
  category?: string | null;
  /** Subcategory */
  subcategory?: string | null;
  /** Tags */
  tags?: string[] | null;
  /** Common Aliases */
  common_aliases?: string[] | null;
  /** Storage Tips */
  storage_tips?: string | null;
  /** Typical Shelf Life */
  typical_shelf_life?: number | null;
  /** Nutritional Highlights */
  nutritional_highlights?: string[] | null;
  /** Recipe Categories */
  recipe_categories?: string[] | null;
  /** Seasonal Availability */
  seasonal_availability?: string | null;
  /** Price Range */
  price_range?: Record<string, number> | null;
  /** Confidence Score */
  confidence_score?: number | null;
}

/**
 * ReceiptItem
 * Individual item extracted from receipt
 */
export interface ReceiptItem {
  /** Name */
  name: string;
  /**
   * Quantity
   * @default 1
   */
  quantity?: number | null;
  /** Price */
  price?: number | null;
  /**
   * Category
   * @default "Other"
   */
  category?: string | null;
  /** Confidence */
  confidence?: number | null;
}

/**
 * ReceiptProcessRequest
 * Request to process extracted receipt data
 */
export interface ReceiptProcessRequest {
  /** Items */
  items: ReceiptItem[];
  /**
   * Add To Pantry
   * @default true
   */
  add_to_pantry?: boolean;
}

/**
 * ReceiptScanResponse
 * Response from receipt scanning
 */
export interface ReceiptScanResponse {
  /** Items */
  items: ReceiptItem[];
  /** Raw Text */
  raw_text: string;
  /** Total Amount */
  total_amount?: number | null;
  /** Store Name */
  store_name?: string | null;
  /** Date */
  date?: string | null;
  /** Processing Time */
  processing_time?: number | null;
}

/**
 * ShoppingListItem
 * Individual item extracted from shopping list
 */
export interface ShoppingListItem {
  /** Name */
  name: string;
  /**
   * Quantity
   * @default 1
   */
  quantity?: number | null;
  /** Unit */
  unit?: string | null;
  /**
   * Category
   * @default "Other"
   */
  category?: string | null;
  /** Confidence */
  confidence?: number | null;
  /**
   * Checked
   * @default false
   */
  checked?: boolean;
}

/** ShoppingListItemRequest */
export interface ShoppingListItemRequest {
  /** Name */
  name: string;
  /**
   * Quantity
   * @default 1
   */
  quantity?: number;
}

/** ShoppingListItemResponse */
export interface ShoppingListItemResponse {
  /** Name */
  name: string;
  /**
   * Quantity
   * @default 1
   */
  quantity?: number;
  /** Id */
  id: string;
  /**
   * Purchased
   * @default false
   */
  purchased?: boolean;
}

/**
 * ShoppingListProcessRequest
 * Request to process extracted shopping list data
 */
export interface ShoppingListProcessRequest {
  /** Items */
  items: ShoppingListItem[];
  /** Shopping List Id */
  shopping_list_id: string;
  /**
   * Add To List
   * @default true
   */
  add_to_list?: boolean;
}

/** ShoppingListRequest */
export interface ShoppingListRequest {
  /** Name */
  name: string;
}

/** ShoppingListResponse */
export interface ShoppingListResponse {
  /** Name */
  name: string;
  /** Id */
  id: string;
}

/**
 * ShoppingListScanResponse
 * Response from shopping list scanning
 */
export interface ShoppingListScanResponse {
  /** Items */
  items: ShoppingListItem[];
  /** Raw Text */
  raw_text: string;
  /** Processing Time */
  processing_time?: number | null;
  /**
   * Total Items Found
   * @default 0
   */
  total_items_found?: number;
}

/** StapleSuggestion */
export interface StapleSuggestion {
  /** Item Id */
  item_id: string;
  /** Item Name */
  item_name: string;
  /** Usage Frequency */
  usage_frequency: number;
  /** Days Since Added */
  days_since_added: number;
  /** Usage Count */
  usage_count: number;
  /** Suggestion Score */
  suggestion_score: number;
  /** Suggestion Reason */
  suggestion_reason: string;
}

/** StapleSuggestionsResponse */
export interface StapleSuggestionsResponse {
  /** Suggestions */
  suggestions: StapleSuggestion[];
  /** Total Suggestions */
  total_suggestions: number;
}

/** StapleToggleRequest */
export interface StapleToggleRequest {
  /** Is Staple */
  is_staple: boolean;
}

/** StaplesStatsResponse */
export interface StaplesStatsResponse {
  /** Total Staples */
  total_staples: number;
  /** Low Stock Staples */
  low_stock_staples: number;
  /** Never Used Staples */
  never_used_staples: number;
  /** Frequently Used Staples */
  frequently_used_staples: number;
}

/** UPCLookupRequest */
export interface UPCLookupRequest {
  /** Upc Code */
  upc_code: string;
}

/** UPCLookupResponse */
export interface UPCLookupResponse {
  product?: ProductInfo | null;
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type TestSecretData = any;

export interface GetHouseholdMembersParams {
  /** Household Id */
  householdId: string;
}

/** Response Get Household Members */
export type GetHouseholdMembersData = HouseholdMember[];

export type GetHouseholdMembersError = HTTPValidationError;

export type CreateHouseholdData = HouseholdResponse;

export type CreateHouseholdError = HTTPValidationError;

export type GetMyHouseholdData = HouseholdResponse;

export interface CreateInvitationParams {
  /** Household Id */
  householdId: string;
}

export type CreateInvitationData = InvitationResponse;

export type CreateInvitationError = HTTPValidationError;

export type JoinHouseholdData = any;

export type JoinHouseholdError = HTTPValidationError;

export type GetNotificationPreferencesData = NotificationPreferences;

export type UpdateNotificationPreferencesData = any;

export type UpdateNotificationPreferencesError = HTTPValidationError;

export interface GetNotificationsParams {
  /**
   * Limit
   * @default 50
   */
  limit?: number;
}

/** Response Get Notifications */
export type GetNotificationsData = NotificationResponse[];

export type GetNotificationsError = HTTPValidationError;

export interface MarkNotificationReadParams {
  /** Notification Id */
  notificationId: string;
}

export type MarkNotificationReadData = any;

export type MarkNotificationReadError = HTTPValidationError;

export type CheckAndCreateNotificationsData = any;

export interface SearchProductsParams {
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
}

/** Response Search Products */
export type SearchProductsData = ProductInfoResponse[];

export type SearchProductsError = HTTPValidationError;

export interface GetProductInfoParams {
  /** Upc */
  upc: string;
}

export type GetProductInfoData = ProductInfoResponse;

export type GetProductInfoError = HTTPValidationError;

export type CreateProductInfoData = ProductInfoResponse;

export type CreateProductInfoError = HTTPValidationError;

export interface UpdateProductInfoParams {
  /** Product Id */
  productId: string;
}

export type UpdateProductInfoData = ProductInfoResponse;

export type UpdateProductInfoError = HTTPValidationError;

/** Products */
export type BulkUpdateProductsPayload = ProductInfoRequest[];

/** Response Bulk Update Products */
export type BulkUpdateProductsData = Record<string, string>;

export type BulkUpdateProductsError = HTTPValidationError;

export interface GetEnhancedUpcInfoParams {
  /** Upc */
  upc: string;
}

export type GetEnhancedUpcInfoData = EnhancedUPCResponse;

export type GetEnhancedUpcInfoError = HTTPValidationError;

/** Response Get Shopping Lists */
export type GetShoppingListsData = ShoppingListResponse[];

export type CreateShoppingListData = ShoppingListResponse;

export type CreateShoppingListError = HTTPValidationError;

export interface DeleteShoppingListParams {
  /** List Id */
  listId: string;
}

export type DeleteShoppingListData = any;

export type DeleteShoppingListError = HTTPValidationError;

export interface AddShoppingListItemParams {
  /** List Id */
  listId: string;
}

export type AddShoppingListItemData = ShoppingListItemResponse;

export type AddShoppingListItemError = HTTPValidationError;

export interface GetShoppingListItemsParams {
  /** List Id */
  listId: string;
}

/** Response Get Shopping List Items */
export type GetShoppingListItemsData = ShoppingListItemResponse[];

export type GetShoppingListItemsError = HTTPValidationError;

export interface UpdateShoppingListItemParams {
  /**
   * List Id
   * List ID
   */
  list_id: string;
  /** Item Id */
  itemId: string;
}

export type UpdateShoppingListItemData = ShoppingListItemResponse;

export type UpdateShoppingListItemError = HTTPValidationError;

export interface DeleteShoppingListItemParams {
  /**
   * List Id
   * List ID
   */
  list_id: string;
  /** Item Id */
  itemId: string;
}

export type DeleteShoppingListItemData = any;

export type DeleteShoppingListItemError = HTTPValidationError;

export type ScanReceiptData = ReceiptScanResponse;

export type ScanReceiptError = HTTPValidationError;

export type ProcessReceiptItemsData = any;

export type ProcessReceiptItemsError = HTTPValidationError;

export type ScanShoppingListData = ShoppingListScanResponse;

export type ScanShoppingListError = HTTPValidationError;

export type ProcessShoppingListItemsData = any;

export type ProcessShoppingListItemsError = HTTPValidationError;

export type LookupUpcProductData = UPCLookupResponse;

export type LookupUpcProductError = HTTPValidationError;

export interface LookupCommunityProductParams {
  /** Upc */
  upc: string;
}

export type LookupCommunityProductData = CommunityProductLookupResponse;

export type LookupCommunityProductError = HTTPValidationError;

export type CreateCommunityProductData = CommunityProductResponse;

export type CreateCommunityProductError = HTTPValidationError;

export interface SearchCommunityProductsParams {
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
}

/** Response Search Community Products */
export type SearchCommunityProductsData = CommunityProductResponse[];

export type SearchCommunityProductsError = HTTPValidationError;

/** Response Get Community Stats */
export type GetCommunityStatsData = Record<string, any>;

export type InterpretCommandData = InterpretResponse;

export type InterpretCommandError = HTTPValidationError;

export interface AddPantryItemParams {
  /** Household Id */
  householdId: string;
}

export type AddPantryItemData = PantryItemResponse;

export type AddPantryItemError = HTTPValidationError;

export interface GetPantryItemsParams {
  /** Household Id */
  householdId: string;
}

/** Response Get Pantry Items */
export type GetPantryItemsData = PantryItemResponse[];

export type GetPantryItemsError = HTTPValidationError;

export interface UpdatePantryItemParams {
  /** Household Id */
  householdId: string;
  /** Item Id */
  itemId: string;
}

export type UpdatePantryItemData = PantryItemResponse;

export type UpdatePantryItemError = HTTPValidationError;

export interface DeletePantryItemParams {
  /** Household Id */
  householdId: string;
  /** Item Id */
  itemId: string;
}

export type DeletePantryItemData = any;

export type DeletePantryItemError = HTTPValidationError;

export interface ConsumePantryItemParams {
  /** Household Id */
  householdId: string;
}

export type ConsumePantryItemData = ConsumptionResponse;

export type ConsumePantryItemError = HTTPValidationError;

export interface GetStaplesParams {
  /** Household Id */
  householdId: string;
}

/** Response Get Staples */
export type GetStaplesData = PantryItemResponse[];

export type GetStaplesError = HTTPValidationError;

export interface ToggleStapleStatusParams {
  /** Household Id */
  householdId: string;
  /** Item Id */
  itemId: string;
}

export type ToggleStapleStatusData = PantryItemResponse;

export type ToggleStapleStatusError = HTTPValidationError;

export interface GetStaplesStatsParams {
  /** Household Id */
  householdId: string;
}

export type GetStaplesStatsData = StaplesStatsResponse;

export type GetStaplesStatsError = HTTPValidationError;

export interface GetStapleSuggestionsParams {
  /** Household Id */
  householdId: string;
}

export type GetStapleSuggestionsData = StapleSuggestionsResponse;

export type GetStapleSuggestionsError = HTTPValidationError;

export interface HandleStapleSuggestionParams {
  /** Household Id */
  householdId: string;
  /** Item Id */
  itemId: string;
  /** Action */
  action: string;
}

export type HandleStapleSuggestionData = any;

export type HandleStapleSuggestionError = HTTPValidationError;

/** Response Log Activity */
export type LogActivityData = Record<string, any>;

export type LogActivityError = HTTPValidationError;

export interface GetHouseholdActivitiesParams {
  /**
   * Limit
   * @default 50
   */
  limit?: number;
}

/** Response Get Household Activities */
export type GetHouseholdActivitiesData = ActivityResponse[];

export type GetHouseholdActivitiesError = HTTPValidationError;
