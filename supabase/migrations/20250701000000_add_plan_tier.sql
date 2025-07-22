-- Add plan_tier column to user_subscriptions table for new pricing structure
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS plan_tier text DEFAULT 'initiate';

-- Update existing records to have a default tier
UPDATE user_subscriptions 
SET plan_tier = 'initiate' 
WHERE plan_tier IS NULL;

-- Add index for plan_tier queries
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_tier ON user_subscriptions(plan_tier);

-- Add constraint to ensure valid plan tiers
ALTER TABLE user_subscriptions 
ADD CONSTRAINT valid_plan_tier 
CHECK (plan_tier IN ('explorer', 'initiate', 'master', 'family'));

-- Create function to get user's current plan tier
CREATE OR REPLACE FUNCTION get_user_plan_tier(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tier text;
BEGIN
    SELECT plan_tier INTO tier
    FROM user_subscriptions
    WHERE user_id = user_uuid 
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(tier, 'none');
END;
$$;

-- Create function to check if user has access to specific features
CREATE OR REPLACE FUNCTION user_has_feature_access(user_uuid uuid, feature_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tier text;
BEGIN
    tier := get_user_plan_tier(user_uuid);
    
    CASE feature_name
        WHEN 'basic_games' THEN
            RETURN tier IN ('explorer', 'initiate', 'master', 'family');
        WHEN 'all_games' THEN
            RETURN tier IN ('initiate', 'master', 'family');
        WHEN 'premium_features' THEN
            RETURN tier IN ('master', 'family');
        WHEN 'family_dashboard' THEN
            RETURN tier = 'family';
        WHEN 'tutoring' THEN
            RETURN tier = 'master';
        ELSE
            RETURN false;
    END CASE;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_plan_tier(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_feature_access(uuid, text) TO authenticated;
