with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

# Add Edit3 icon to imports
if "Edit3" not in text:
    text = text.replace("ExternalLink, Loader2", "ExternalLink, Loader2, Edit3")

old_btns = """                        <Link href={`/elan/${ad.id}`} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDeleteAd(ad.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>"""

new_btns = """                        <Link href={`/elan/${ad.id}`} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors" title="Elana bax">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link href={`/redakte/${ad.id}`} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Redaktə et">
                          <Edit3 className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDeleteAd(ad.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Sil">
                          <Trash2 className="w-5 h-5" />
                        </button>"""

text = text.replace(old_btns, new_btns)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
