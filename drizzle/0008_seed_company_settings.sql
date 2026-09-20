INSERT INTO public.company_settings (
    id,
    trade_name
)
VALUES (
    'company',
    'FST Negocios'
)
ON CONFLICT (id)
DO NOTHING;


INSERT INTO public.quotation_settings (
    id,
    currency_code,
    igv_rate,
    prices_include_igv,
    default_cash_discount,
    default_installment_discount,
    default_card_months,
    quotation_prefix,
    numbering_padding,
    reset_numbering_yearly
)
VALUES (
    'quotation',
    'PEN',
    18.00,
    TRUE,
    30.00,
    20.00,
    12,
    'COT',
    6,
    TRUE
)
ON CONFLICT (id)
DO NOTHING;