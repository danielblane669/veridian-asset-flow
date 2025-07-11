
-- Create a function to add profit for the specific user
CREATE OR REPLACE FUNCTION add_hourly_profit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Find the user by email
    SELECT au.id INTO target_user_id
    FROM auth.users au
    WHERE au.email = 'danielblane669@gmail.com';
    
    -- Only proceed if user exists
    IF target_user_id IS NOT NULL THEN
        -- Add $500 to user's profit in profiles table
        UPDATE profiles 
        SET 
            profit = COALESCE(profit, 0) + 500,
            total_portfolio = COALESCE(total_portfolio, 0) + 500,
            updated_at = now()
        WHERE id = target_user_id;
        
        -- Create a transaction record
        INSERT INTO transactions (
            user_id, 
            type, 
            amount, 
            currency, 
            status, 
            hash
        ) VALUES (
            target_user_id,
            'Profit',
            500.00,
            'USD',
            'Completed',
            'hourly_profit_' || extract(epoch from now())::text
        );
    END IF;
END;
$$;

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run every 60 minutes
SELECT cron.schedule(
    'hourly-profit-addition',
    '0 * * * *', -- Every hour at minute 0
    'SELECT add_hourly_profit();'
);
