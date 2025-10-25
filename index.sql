-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.deliveries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  delivery_number text NOT NULL UNIQUE,
  status USER-DEFINED DEFAULT 'pending'::delivery_status,
  carrier text,
  tracking_number text,
  scheduled_date date,
  delivered_date timestamp with time zone,
  delivery_address text,
  recipient_name text,
  recipient_phone text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT deliveries_pkey PRIMARY KEY (id),
  CONSTRAINT deliveries_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.incognito_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_token text NOT NULL UNIQUE,
  user_id uuid,
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT incognito_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT incognito_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.inventory (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid UNIQUE,
  quantity_in_stock integer DEFAULT 0,
  reorder_level integer DEFAULT 10,
  reorder_quantity integer DEFAULT 50,
  warehouse_location text,
  last_restocked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  invoice_number text NOT NULL UNIQUE,
  order_id uuid,
  retailer_id uuid,
  status USER-DEFINED DEFAULT 'draft'::invoice_status,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  subtotal numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  notes text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT invoices_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES public.retailers(id),
  CONSTRAINT invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  product_id uuid,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  tax_rate numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  line_total numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_number text NOT NULL UNIQUE,
  retailer_id uuid,
  status USER-DEFINED DEFAULT 'pending'::order_status,
  subtotal numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  notes text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES public.retailers(id),
  CONSTRAINT orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  payment_number text NOT NULL UNIQUE,
  invoice_id uuid,
  retailer_id uuid,
  amount numeric NOT NULL,
  payment_method text,
  payment_date timestamp with time zone DEFAULT now(),
  status USER-DEFINED DEFAULT 'pending'::payment_status,
  reference_number text,
  notes text,
  is_same_day boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT payments_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES public.retailers(id),
  CONSTRAINT payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text,
  brand text,
  unit_price numeric NOT NULL,
  cost_price numeric,
  tax_rate numeric DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role USER-DEFINED DEFAULT 'viewer'::user_role,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.retailers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  credit_limit numeric DEFAULT 0,
  outstanding_balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT retailers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.same_day_payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  payment_id uuid,
  processed_at timestamp with time zone DEFAULT now(),
  processing_fee numeric DEFAULT 0,
  net_amount numeric NOT NULL,
  approved_by uuid,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT same_day_payments_pkey PRIMARY KEY (id),
  CONSTRAINT same_day_payments_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id),
  CONSTRAINT same_day_payments_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  employee_id text NOT NULL UNIQUE,
  department text,
  position text,
  phone text,
  hire_date date,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT staff_pkey PRIMARY KEY (id),
  CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);