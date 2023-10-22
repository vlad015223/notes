from transliterate import translit, slugify

def generate_slug(text):
    latin_text = translit(text, 'ru', reversed=True)
    slug = slugify(latin_text)
    return slug
