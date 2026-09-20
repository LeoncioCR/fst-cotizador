INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'company-assets',
    'company-assets',
    FALSE,
    2097152,
    ARRAY[
        'image/png',
        'image/jpeg',
        'image/webp'
    ]
)
ON CONFLICT (id)
DO NOTHING;