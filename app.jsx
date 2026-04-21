const { useState, useMemo, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

// Componente Immagine ottimizzato per evitare loop di errore e layout shift
const ProductImage = React.memo(({ src, alt, className, id, loading = "lazy" }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (imgSrc !== src) {
            setImgSrc(src);
            setHasError(false);
            setIsLoaded(false);
        }
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(`https://placehold.co/600x600/f1f5f9/00429d?text=Art.+${id}`);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-0">
                    <div className="w-6 h-6 border-2 border-smc-blue/10 border-t-smc-blue/40 rounded-full animate-spin"></div>
                </div>
            )}
            <img 
                src={imgSrc} 
                alt={alt}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={handleError}
                referrerPolicy="no-referrer"
                loading={loading}
            />
        </div>
    );
});

// Helper per le icone Lucide - Versione ultra-leggera e performante
const Icon = ({ name, size = 20, className = "" }) => {
    // Usiamo icone SVG dirette per le icone più comuni per evitare scansioni del DOM
    const getStaticIcon = (name) => {
        const icons = {
            'phone': <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
            'mail': <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
            'message-circle': <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>,
            'file-text': <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></>,
            'search': <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
            'filter': <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
            'chevron-right': <path d="m9 18 6-6-6-6"/>,
            'x': <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
            'shopping-cart': <><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></>,
            'plus': <><path d="M12 5v14"/><path d="M5 12h14"/></>,
            'minus': <line x1="5" x2="19" y1="12" y2="12"/>,
            'check': <polyline points="20 6 9 17 4 12"/>,
            'info': <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></>,
            'package': <><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>,
            'globe': <><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></>,
            'hard-hat': <><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a8 8 0 1 1 16 0v3"/></>,
            'trash-2': <><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></>,
            'download': <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="3" y2="15"/></>,
            'building-2': <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></>,
            'hash': <><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></>,
            'zap': <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
            'palette': <><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.39 2.3-1.03.35-.37.6-.86.7-1.37.1-.5.06-1.01-.07-1.5-.13-.5-.17-1.02-.13-1.54.04-.52.2-1.03.46-1.49.26-.46.6-.86 1.01-1.17.41-.31.89-.53 1.4-.64.51-.11 1.04-.12 1.56-.03.52.09 1.03.3 1.48.63.45.33.82.76 1.09 1.25.27.49.43 1.05.46 1.62.03.57-.06 1.13-.27 1.67-.21.54-.55 1.03-1 1.43-.45.4-1.01.67-1.61.79-.6.12-1.23.1-1.83-.06-.6-.16-1.16-.46-1.63-.87-.47-.41-.83-.93-1.05-1.51-.22-.58-.3-1.21-.23-1.83.07-.62.28-1.22.61-1.75.33-.53.78-.98 1.31-1.31.53-.33 1.13-.54 1.75-.61.62-.07 1.25.01 1.83.23.58.22 1.1.58 1.51 1.05.41.47.71 1.03.87 1.63.16.6.18 1.23.06 1.83-.12.6-.39 1.16-.79 1.61-.4.45-.89.79-1.43 1-.54.21-1.1.3-1.67.27-.57-.03-1.13-.19-1.62-.46-.49-.27-.92-.64-1.25-1.09-.33-.45-.54-.96-.63-1.48-.09-.52-.08-1.05.03-1.56.11-.51.33-.99.64-1.4.31-.41.71-.75 1.17-1.01.46-.26.97-.42 1.49-.46.52-.04 1.04 0 1.54.13.49.13 1 .17 1.5.07.5-.1.99-.35 1.37-.7.64-.6 1.03-1.38 1.03-2.3 0-5.5-4.5-10-10-10Z"/></>,
            'shopping-bag': <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
            'arrow-right': <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
            'shield-check': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></>,
            'truck': <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5.05a1 1 0 0 0-.39-.81l-4.57-3.42a1 1 0 0 0-.61-.22H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
            'headphones': <><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></>,
            'map-pin': <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
            'mouse-pointer-2': <><path d="m12 12 4 10 1.7-4.3L22 16Z"/><path d="m7 7 5 5-5 5-5-5Z"/></>
        };
        return icons[name] || null;
    };

    const staticIcon = getStaticIcon(name);
    if (staticIcon) {
        return (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={size} 
                height={size} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={className}
            >
                {staticIcon}
            </svg>
        );
    }

    // Fallback per icone meno comuni - Usiamo un contenitore isolato per evitare errori removeChild
    return (
        <span 
            className={`inline-flex items-center justify-center ${className}`} 
            style={{ width: size, height: size }}
            ref={el => {
                if (el && window.lucide) {
                    const icon = el.querySelector('i');
                    if (icon && !icon.hasAttribute('data-lucide-initialized')) {
                        window.lucide.createIcons({ nameAttr: 'data-lucide', icons: [name] });
                        icon.setAttribute('data-lucide-initialized', 'true');
                    }
                }
            }}
        >
            <i data-lucide={name} style={{ width: size, height: size }}></i>
        </span>
    );
};

const { COLOR_MAP, SMC_PRODUCTS, CATEGORIES } = window;
const smcUtils = window.SMC_UTILS;

function App() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallDismissed, setIsInstallDismissed] = useState(localStorage.getItem('smc_install_dismissed') === 'true');
    const [showInstructions, setShowInstructions] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isFirefox, setIsFirefox] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Rilevamento ambiente
        const ua = navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(ua));
        setIsFirefox(/firefox/.test(ua));
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setDeferredPrompt(null);
        } else {
            setShowInstructions(!showInstructions);
        }
    };

    const dismissInstall = (e) => {
        e.stopPropagation();
        setIsInstallDismissed(true);
        localStorage.setItem('smc_install_dismissed', 'true');
    };

    const [products, setProducts] = useState([]);
    const [isCsvLoading, setIsCsvLoading] = useState(true);
    const [filters, setFilters] = useState({ cat: "Tutti", sub: "Tutte", color: "Tutti" });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeColor, setActiveColor] = useState("Bianco");
    const colorTimeoutRef = useRef(null);

    // Caricamento CSV all'avvio
    useEffect(() => {
        const loadCsvData = async () => {
            try {
                const response = await fetch('./Inventario - DB.csv');
                const csvText = await response.text();
                
                window.Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const mappedProducts = results.data.map(row => {
                            // Costruiamo l'array dei colori controllando le colonne TRUE
                            const colors = [];
                            if (row['Bianco(_B)'] === 'TRUE') colors.push('Bianco');
                            if (row['Nero(_N)'] === 'TRUE') colors.push('Nero');
                            if (row['Marrone(_M)'] === 'TRUE') colors.push('Marrone');
                            if (row['Oro(_O)'] === 'TRUE') colors.push('Oro');
                            if (row['Argento(_A)'] === 'TRUE') colors.push('Argento');
                            if (row['Trasparente(_T)'] === 'TRUE') colors.push('Trasparente');
                            if (row['Nickelato(_NK)'] === 'TRUE') colors.push('Nickelato');
                            if (row['Grigio(_G)'] === 'TRUE') colors.push('Grigio');

                            return {
                                id: row['Cod.Articolo'],
                                name: row['Nome Prodotto'],
                                cat: row['Categoria'],
                                sub: row['Sottocategoria'],
                                desc: row['Descrizione'],
                                specs: row['Specifiche Tecniche'],
                                conf: parseInt(row['Conf.(pz)']) || 0,
                                box: parseInt(row['Box(pz)']) || 0,
                                colors: colors.length > 0 ? colors : ['Bianco'] // Fallback se nessun colore è segnato
                            };
                        });
                        
                        setProducts(mappedProducts);
                        setIsCsvLoading(false);
                        console.log('Catalogo caricato dal CSV:', mappedProducts.length, 'prodotti');
                    },
                    error: (error) => {
                        console.error('Errore PapaParse:', error);
                        setProducts(window.SMC_PRODUCTS || []); // Fallback
                        setIsCsvLoading(false);
                    }
                });
            } catch (error) {
                console.error('Errore caricamento file CSV:', error);
                setProducts(window.SMC_PRODUCTS || []); // Fallback
                setIsCsvLoading(false);
            }
        };

        loadCsvData();
    }, []);

    // Alias per compatibilità con il resto del codice
    const activeCategory = filters.cat;
    const activeSubCategory = filters.sub;
    const activeColorFilter = filters.color;

    const handleColorChange = (color) => {
        if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
        
        // Debounce the state update to prevent rapid-fire glitches
        colorTimeoutRef.current = setTimeout(() => {
            setActiveColor(color);
        }, 50);
    };

    // Gestione atomica dei filtri per evitare doppi rendering
    const handleCategoryChange = (cat) => {
        setFilters({ cat, sub: "Tutte", color: "Tutti" });
    };

    const handleSubCategoryChange = (sub) => {
        setFilters(prev => ({ ...prev, sub, color: "Tutti" }));
    };

    const handleColorFilterChange = (color) => {
        setFilters(prev => ({ ...prev, color }));
    };

    // Precaricamento immagini varianti
    useEffect(() => {
        if (selectedProduct) {
            selectedProduct.colors.forEach(color => {
                const img = new Image();
                img.src = smcUtils.getImageUrl(selectedProduct.id, color);
            });
        }
    }, [selectedProduct]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState("conf"); // "conf" o "box"
    const [quoteItems, setQuoteItems] = useState([]);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isPdfGenerating, setIsPdfGenerating] = useState(false);

    // Sincronizzazione stato preventivo con Hash URL
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#quote') {
                setIsQuoteOpen(true);
            } else if (isQuoteOpen && hash !== '#quote') {
                setIsQuoteOpen(false);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        // Controllo iniziale
        if (window.location.hash === '#quote') setIsQuoteOpen(true);
        
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [isQuoteOpen]);

    // Quando lo stato isQuoteOpen cambia manualmente (es. cliccando X), aggiorno l'hash
    useEffect(() => {
        const currentHash = window.location.hash;
        if (isQuoteOpen) {
            if (currentHash !== '#quote') {
                window.location.hash = '#quote';
            }
        } else {
            if (currentHash === '#quote') {
                // Se chiudiamo il preventivo e l'hash è ancora #quote, torniamo indietro
                window.history.back();
            }
        }
    }, [isQuoteOpen]);

    // Deep Linking & Browser Navigation
    useEffect(() => {
        const handleHashChange = () => {
            const hash = decodeURIComponent(window.location.hash.replace('#', ''));
            if (hash && hash !== 'quote') {
                const product = products.find(p => p.id === hash);
                if (product) {
                    // Aggiorna solo se il prodotto è effettivamente diverso
                    setSelectedProduct(prev => (prev && prev.id === product.id) ? prev : product);
                    return;
                }
            }
            setSelectedProduct(null);
        };

        // Controllo iniziale e listener per cambiamenti manuali nell'URL
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [products]);

    // Sincronizza l'URL quando la selezione del prodotto cambia nell'interfaccia
    useEffect(() => {
        const currentHash = window.location.hash.replace('#', '');
        if (selectedProduct) {
            if (currentHash !== selectedProduct.id) {
                window.location.hash = '#' + selectedProduct.id;
            }
        } else if (currentHash !== '') {
            // Rimuove l'hash senza aggiungere uno step inutile nella cronologia se stiamo chiudendo
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }, [selectedProduct]);

    // Sottocategorie dinamiche in base alla categoria attiva
    const subCategories = useMemo(() => {
        const subs = products
            .filter(p => activeCategory === "Tutti" || p.cat === activeCategory)
            .map(p => p.sub);
        return ["Tutte", ...Array.from(new Set(subs))];
    }, [activeCategory, products]);

    // Colori disponibili in base alla selezione corrente
    const availableColors = useMemo(() => {
        const colors = new Set();
        products
            .filter(p => {
                const matchesCategory = activeCategory === "Tutti" || p.cat === activeCategory;
                const matchesSubCategory = activeSubCategory === "Tutte" || p.sub === activeSubCategory;
                return matchesCategory && matchesSubCategory;
            })
            .forEach(p => p.colors.forEach(c => colors.add(c)));
        
        // Rimuoviamo "Rosso" dai filtri come richiesto dall'utente
        const filteredColors = Array.from(colors).filter(c => c !== "Rosso");
        return ["Tutti", ...filteredColors];
    }, [activeCategory, activeSubCategory, products]);

    // Reset filtri quando si effettua una ricerca per garantire una ricerca globale
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            setFilters({ cat: "Tutti", sub: "Tutte", color: "Tutti" });
        }
    }, [searchQuery]);

    // Reset colore quando cambia il prodotto selezionato
    useEffect(() => {
        if (selectedProduct) {
            // Se c'è un filtro colore attivo e il prodotto lo supporta, usalo come colore iniziale
            const initialColor = (activeColorFilter !== "Tutti" && selectedProduct.colors.includes(activeColorFilter)) 
                ? activeColorFilter 
                : selectedProduct.colors[0];
            
            setActiveColor(initialColor);
            setSelectedQuantity(1);
            setSelectedUnit("conf");
        }
    }, [selectedProduct, activeColorFilter]);

    // Scroll automatico ai risultati quando si cerca (specialmente utile su mobile)
    useEffect(() => {
        if (searchQuery) {
            const element = document.getElementById('product-grid');
            if (element) {
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [searchQuery]);

    // Filtro combinato: Categoria + Sottocategoria + Colore + Ricerca
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = activeCategory === "Tutti" || p.cat === activeCategory;
            const matchesSubCategory = activeSubCategory === "Tutte" || p.sub === activeSubCategory;
            const matchesColor = activeColorFilter === "Tutti" || p.colors.includes(activeColorFilter);
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.sub.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSubCategory && matchesColor && matchesSearch;
        });
    }, [activeCategory, activeSubCategory, activeColorFilter, searchQuery, products]);

    // Funzioni Preventivo
    const addToQuote = (product, color, quantity = 1, unit = "conf") => {
        const existingIndex = quoteItems.findIndex(item => 
            item.product.id === product.id && 
            item.color === color && 
            item.unit === unit
        );
        if (existingIndex > -1) {
            const newItems = [...quoteItems];
            newItems[existingIndex].quantity += quantity;
            setQuoteItems(newItems);
        } else {
            setQuoteItems([...quoteItems, { 
                id: `${product.id}-${color}-${unit}-${Date.now()}`, 
                product, 
                color, 
                quantity, 
                unit 
            }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setQuoteItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const handleExportToPDF = () => {
        if (isPdfGenerating) return;
        smcUtils.exportToPDF(quoteItems, setIsPdfGenerating);
    };

    const removeFromQuote = (id) => {
        setQuoteItems(prev => prev.filter(item => item.id !== id));
    };

    // Registrazione Service Worker per PWA
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('Service Worker registrato con successo'))
                    .catch(err => console.log('Errore registrazione Service Worker:', err));
            });
        }
    }, []);

    const isEdile = activeCategory === "Materiale Edile";

    if (isCsvLoading) {
        return (
            <div className="fixed inset-0 bg-slate-100 flex flex-col items-center justify-center z-[9999]">
                <div className="w-12 h-12 border-4 border-smc-blue/10 border-t-smc-blue rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium animate-pulse">Caricamento catalogo...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isEdile ? 'bg-slate-300' : 'bg-slate-200'} font-sans text-slate-900 selection:bg-smc-red selection:text-white flex flex-col`}>
            {/* Header */}
            <header className="bg-smc-blue text-white shadow-xl md:sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center shrink-0">
                        <img 
                            src="./logo.png" 
                            alt="SMC Logo" 
                            className="h-12 md:h-10 w-auto object-contain"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    
                    <div className="flex-grow max-w-xl relative hidden md:block">
                        <input 
                            type="text"
                            placeholder="Cerca per codice o nome prodotto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 bg-white/10 border border-white/20 rounded-none px-4 text-sm focus:bg-white focus:text-smc-blue focus:outline-none transition-all placeholder:text-white/50"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <button 
                            onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
                            className="h-9 bg-white/10 hover:bg-smc-red transition-all rounded-none flex items-center gap-2 px-4 text-[10px] uppercase tracking-[0.2em] font-black"
                        >
                            <Icon name="phone" size={16} />
                            <span>Contatti</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <a 
                                href="mailto:scribani.mary@live.it" 
                                className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-smc-red transition-all rounded-none group"
                                title="Invia Email"
                            >
                                <Icon name="mail" size={18} />
                            </a>
                            <a 
                                href="https://wa.me/393662481736" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-[#25D366] transition-all rounded-none group"
                                title="WhatsApp"
                            >
                                <Icon name="message-circle" size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="flex md:hidden items-center gap-2">
                        <a href="tel:+393662481736" className="p-2 bg-white/10 active:bg-smc-red transition-all rounded-none">
                            <Icon name="phone" size={18} />
                        </a>
                        <a href="https://wa.me/393662481736" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 active:bg-[#25D366] transition-all rounded-none">
                            <Icon name="message-circle" size={18} />
                        </a>
                        <a href="mailto:scribani.mary@live.it" className="p-2 bg-white/10 active:bg-smc-red transition-all rounded-none">
                            <Icon name="mail" size={18} />
                        </a>
                    </div>

                    <button 
                        onClick={() => setIsQuoteOpen(true)}
                        className="hidden md:flex relative h-9 bg-white/10 hover:bg-smc-red transition-all rounded-none group items-center gap-1.5 px-2 md:px-4 md:gap-2"
                    >
                        <Icon name="file-text" size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Preventivo</span>
                        {quoteItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-smc-red text-white text-[8px] font-black w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center rounded-none border border-smc-blue">
                                {quoteItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Company Info Bar (Under menu, not sticky, smc-red) */}
            <div className="bg-smc-red text-white py-1.5 px-2 md:px-4 text-[9px] font-bold uppercase tracking-[0.15em] border-b border-white/10 z-30">
                <div className="max-w-7xl mx-auto relative overflow-hidden">
                    <div 
                        className="flex flex-nowrap items-center overflow-x-auto no-scrollbar md:justify-between"
                        onScroll={(e) => {
                            if (window.innerWidth >= 768) return;
                            const el = e.target;
                            const scrollLeft = el.scrollLeft;
                            const scrollWidth = el.scrollWidth;
                            const halfWidth = scrollWidth / 2;
                            
                            if (scrollLeft >= halfWidth) {
                                el.scrollLeft = scrollLeft - halfWidth;
                            } else if (scrollLeft <= 0) {
                                el.scrollLeft = halfWidth;
                            }
                        }}
                    >
                        {/* Render items twice for infinite scroll effect on mobile */}
                        {[1, 2].map((set) => (
                            <div key={set} className={`flex flex-nowrap items-center gap-10 md:gap-6 flex-shrink-0 ${set === 1 ? 'pr-10 md:pr-0' : 'md:hidden'}`}>
                                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                                    <Icon name="phone" size={12} className="text-white/60 shrink-0" />
                                    <span className="leading-none whitespace-nowrap">+39 366 24 81 736</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 md:border-l md:border-white/20 md:pl-4 flex-shrink-0">
                                    <Icon name="hash" size={12} className="text-white/60 shrink-0" />
                                    <span className="leading-none whitespace-nowrap">P.IVA 04460430616</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 md:border-l md:border-white/20 md:pl-4 flex-shrink-0">
                                    <Icon name="building-2" size={12} className="text-white/60 shrink-0" />
                                    <span className="text-white leading-none whitespace-nowrap">SMC Scribani S.r.l.</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 md:border-l md:border-white/20 md:pl-4 flex-shrink-0">
                                    <Icon name="mail" size={12} className="text-white/60 shrink-0" />
                                    <span className="leading-none whitespace-nowrap">scribani.mary@live.it</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Arrow indicator for mobile */}
                    <div className="absolute right-0 top-0 bottom-0 flex items-center px-2 bg-gradient-to-l from-smc-red via-smc-red/80 to-transparent md:hidden pointer-events-none">
                        <Icon name="chevron-right" size={10} className="text-white/80 animate-pulse" />
                    </div>
                </div>
            </div>

            <main className="flex-grow">
                {/* Hero / Title Section */}
            <section className={`text-white relative overflow-hidden min-h-[50vh] flex items-center transition-colors duration-700 ${isEdile ? 'bg-[#0a0a0a]' : 'bg-[#001a33]'}`}>
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute inset-0 transition-all duration-700 ${isEdile ? 'bg-gradient-to-br from-black via-[#111] to-[#050505]' : 'bg-gradient-to-br from-[#001a33] via-[#002b4d] to-black'}`}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] mix-blend-overlay"></div>
                    <div className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ${isEdile ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(227,30,36,0.15)_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_20%_20%,rgba(227,30,36,0.1)_0%,transparent_50%)]'}`}></div>
                    <div className={`absolute bottom-0 right-0 w-full h-full transition-all duration-700 ${isEdile ? 'bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_80%_80%,rgba(0,66,157,0.2)_0%,transparent_50%)]'}`}></div>
                    
                    {/* Animated Light Beam */}
                    <motion.div 
                        animate={{ 
                            x: ['-100%', '100%'],
                            opacity: [0, 0.4, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -skew-x-12"
                    />
                    
                    {/* Technical Grid Overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 lg:py-24 relative z-10 w-full">
                    <div className="flex flex-col gap-0">
                        {/* Top Label */}
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="flex flex-col">
                                <span className="text-smc-red font-black uppercase tracking-[0.5em] text-[10px] leading-none">SMC Scribani S.r.l.</span>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-8 h-[1px] bg-white/20"></span>
                                    <span className="text-[8px] text-white/60 uppercase tracking-[0.3em] font-mono">
                                        {isEdile ? "Professional Building Solutions" : "Industrial Standard / CEI 23-50"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Main Title */}
                        <div className="relative">
                            <h2 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter leading-[0.8] font-display">
                                <div className="overflow-hidden">
                                    <motion.span 
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="block text-white"
                                    >
                                        {activeCategory === "Tutti" ? "Componenti" : activeCategory}
                                    </motion.span>
                                </div>
                                {activeCategory === "Tutti" && (
                                    <div className="overflow-hidden mt-1">
                                        <motion.span 
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                            className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40"
                                            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
                                        >
                                            Elettrici
                                        </motion.span>
                                    </div>
                                )}
                            </h2>
                            
                            {/* Floating Badge */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -top-4 -right-2 md:right-0 bg-smc-red text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest rotate-12 shadow-lg shadow-smc-red/20"
                            >
                                Italian Quality
                            </motion.div>
                        </div>

                        {/* Technical Info & Logo Grid */}
                        <div 
                            className="flex flex-col md:grid md:grid-cols-3 gap-8 mt-8 md:mt-20 border-t border-white/10 pt-8"
                        >
                            {/* Quality Statement - Hidden on mobile for compactness */}
                            <div className="hidden md:flex flex-col justify-center">
                                <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] mb-2 font-mono">Certification</span>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin italic text-smc-red font-display leading-none tracking-[-0.05em] drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    di Qualità
                                </h3>
                            </div>

                            {/* Technical Specs */}
                            <div className="flex items-center md:border-l border-white/10 md:pl-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3" key={`text-block-${isEdile}`}>
                                        {isEdile && (
                                            <div key="hardhat-icon">
                                                <Icon name="hard-hat" size={20} className="text-smc-red shrink-0 mt-1" />
                                            </div>
                                        )}
                                        <p className="text-[10px] md:text-xs font-light text-white/50 leading-relaxed uppercase tracking-[0.15em]">
                                            {isEdile 
                                                ? "Soluzioni professionali per l'edilizia: distanziatori livellanti, sistemi di posa e accessori tecnici per CANTIERI D'ECCELLENZA."
                                                : "Produzione e distribuzione di connettori, spine, adattatori elettrici e accessori conformi alle norme CEI 23-50."
                                            }
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-white/30 uppercase">{isEdile ? "Settore" : "Origin"}</span>
                                            <span className="text-[9px] text-white/70 font-bold">{isEdile ? "EDILIZIA" : "ITALY"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-white/30 uppercase">{isEdile ? "Standard" : "Market"}</span>
                                            <span className="text-[9px] text-white/70 font-bold">{isEdile ? "PROFESSIONAL" : "EUROPE"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logo Presentation */}
                            <div className="flex flex-col sm:flex-row items-center justify-end gap-6 md:border-l border-white/10 md:pl-8 pt-4 md:pt-0">
                                {/* PWA Install Button - Mobile Only, Hidden if dismissed or standalone */}
                                {!isInstallDismissed && !isStandalone && (deferredPrompt || isIOS || isFirefox) && (
                                    <div className="md:hidden relative">
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center"
                                        >
                                            <button 
                                                onClick={handleInstallClick}
                                                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 transition-all duration-300 relative"
                                            >
                                                <div className="w-8 h-8 bg-smc-red flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Icon name="download" size={14} className="text-white" />
                                                </div>
                                                <div className="text-left pr-4">
                                                    <span className="block text-[7px] font-black uppercase tracking-[0.2em] text-white/40 leading-none mb-1">PWA App</span>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-white leading-none">Installa</span>
                                                </div>
                                            </button>
                                            <button 
                                                onClick={dismissInstall}
                                                className="h-[46px] px-3 bg-white/5 border-y border-r border-white/10 text-white/30 hover:text-white transition-colors"
                                                aria-label="Chiudi suggerimento"
                                            >
                                                <Icon name="x" size={14} />
                                            </button>
                                        </motion.div>

                                        {/* Elegant Tooltip for iOS/Firefox */}
                                        <AnimatePresence>
                                            {showInstructions && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute bottom-full left-0 right-0 mb-4 z-[100]"
                                                >
                                                    <div className="bg-slate-900 border border-white/10 p-4 shadow-2xl relative">
                                                        <p className="text-[10px] font-medium text-white/90 leading-relaxed uppercase tracking-wider">
                                                            {isIOS ? (
                                                                <>Per installare: clicca l'icona <span className="text-smc-red font-bold">Condividi</span> e seleziona <span className="text-smc-red font-bold">"Aggiungi a Home"</span></>
                                                            ) : (
                                                                <>Per installare: apri il <span className="text-smc-red font-bold">Menu</span> del browser e seleziona <span className="text-smc-red font-bold">"Installa"</span> o <span className="text-smc-red font-bold">"Aggiungi a Home"</span></>
                                                            )}
                                                        </p>
                                                        {/* Arrow */}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900"></div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-smc-red/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <motion.img 
                                        whileHover={{ scale: 1.05, rotate: -2 }}
                                        src="./logo.png" 
                                        alt="SMC Logo" 
                                        className="h-14 md:h-16 lg:h-20 w-auto object-contain relative z-10 drop-shadow-2xl"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter & Control Panel */}
            <section className="max-w-7xl mx-auto px-0 md:px-4 -mt-8 relative z-20 w-full">
                <div className="bg-white shadow-2xl border border-slate-200 px-4 pt-4 pb-2 md:p-6 space-y-5 w-full">
                    {/* Main Categories - App Style with Icons */}
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2 px-1 md:hidden">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Esplora Categorie</p>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">scorri</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </div>
                        </div>
                        
                        {/* Mobile Icon View */}
                        <div className="md:hidden flex flex-nowrap gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-3">
                            {CATEGORIES.map(cat => {
                                const isActive = activeCategory === cat;
                                
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        aria-label={`Filtra per categoria ${cat}`}
                                        className="flex flex-col items-center gap-3 flex-shrink-0 transition-all duration-500"
                                    >
                                        <div className={`relative w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 ${
                                            isActive 
                                                ? (cat === "Materiale Edile" ? 'bg-[#0a0a0a] text-white shadow-[0_15px_35px_rgba(0,0,0,0.25)] scale-110' : 'bg-smc-blue text-white shadow-[0_15px_35px_rgba(0,66,157,0.25)] scale-110')
                                                : 'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100'
                                        }`}>
                                            {cat === "Tutti" && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                                            {cat.toLowerCase().includes("elettrico") && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                                            {cat.toLowerCase().includes("tv") && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>}
                                            {cat.toLowerCase().includes("edile") && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>}
                                            {cat.toLowerCase().includes("fissaggio") && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.5"} strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] leading-tight transition-colors duration-300 ${
                                            isActive ? 'text-smc-blue' : 'text-slate-400'
                                        }`}>
                                            {cat.toLowerCase().includes("elettrico") ? "Elettrico" : 
                                             cat.toLowerCase().includes("tv") ? "TV" : 
                                             cat.toLowerCase().includes("edile") ? "Edile" :
                                             cat.toLowerCase().includes("fissaggio") ? "Fissaggio" : cat}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Desktop Classic View */}
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Categorie</p>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        aria-label={`Filtra per categoria ${cat}`}
                                        className={`whitespace-nowrap px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-none border-2 transition-all duration-300 ${
                                            activeCategory === cat 
                                                ? (cat === "Materiale Edile" ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white shadow-lg' : 'bg-smc-blue border-smc-blue text-white shadow-lg')
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-smc-blue hover:text-smc-blue'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Subcategories - Refined Mobile Style */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="relative"
                        >
                            <div className="flex items-center justify-between mb-2 px-1 md:px-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/60">
                                    Sottocategorie {activeCategory !== "Tutti" ? `di ${activeCategory}` : ""}
                                </p>
                                <div className="flex items-center gap-2 ml-auto md:hidden">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">scorri</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </div>
                            </div>
                            
                            <div className="flex flex-nowrap md:flex-wrap gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar pt-2 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                                {subCategories.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => handleSubCategoryChange(sub)}
                                        aria-label={`Filtra per sottocategoria ${sub}`}
                                        className={`px-0.5 py-2 md:px-5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-tight md:tracking-widest rounded-[22px] md:rounded-none border-2 transition-all duration-300 flex-shrink-0 flex flex-col md:flex-row items-center justify-center text-center w-[74px] h-[74px] md:w-auto md:h-auto md:min-w-0 md:min-h-0 md:block ${
                                            activeSubCategory === sub 
                                                ? 'bg-smc-red border-smc-red text-white shadow-[0_10px_20px_rgba(239,68,68,0.2)] scale-105 md:scale-100' 
                                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-smc-red hover:text-smc-red'
                                        }`}
                                    >
                                        <span className="md:hidden">
                                            {(() => {
                                                const words = sub.split(' ');
                                                if (words.length <= 1) return <span className="block leading-[1.1] whitespace-nowrap">{sub}</span>;
                                                if (words.length === 2) return (
                                                    <>
                                                        <span className="block leading-[1.1] whitespace-nowrap">{words[0]}</span>
                                                        <span className="block leading-[1.1] whitespace-nowrap">{words[1]}</span>
                                                    </>
                                                );
                                                if (words.length === 3) {
                                                    const line1_2 = `${words[0]} ${words[1]}`;
                                                    const line2_3 = `${words[1]} ${words[2]}`;
                                                    // Se la riga con le prime due parole è più corta (o uguale) di quella con le ultime due
                                                    if (line1_2.length <= line2_3.length) {
                                                        return (
                                                            <>
                                                                <span className="block leading-[1.1] whitespace-nowrap">{line1_2}</span>
                                                                <span className="block leading-[1.1] whitespace-nowrap">{words[2]}</span>
                                                            </>
                                                        );
                                                    } else {
                                                        return (
                                                            <>
                                                                <span className="block leading-[1.1] whitespace-nowrap">{words[0]}</span>
                                                                <span className="block leading-[1.1] whitespace-nowrap">{line2_3}</span>
                                                            </>
                                                        );
                                                    }
                                                }
                                                // Fallback per 4+ parole: una riga per parola per sicurezza
                                                return words.map((word, i) => (
                                                    <span key={i} className="block leading-[1.1] whitespace-nowrap">{word}</span>
                                                ));
                                            })()}
                                        </span>
                                        <span className="hidden md:inline whitespace-nowrap">
                                            {sub}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Color Filter - Modern Dot Style */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-1 md:px-0">
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/60">Filtra per Colore</p>
                                <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-widest text-smc-blue bg-smc-blue/5 px-2 py-0.5 border border-smc-blue/10">
                                    {activeColorFilter}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto md:hidden">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">scorri</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </div>
                        </div>
                        
                        <div className="flex flex-nowrap md:flex-wrap gap-4 md:gap-4 overflow-x-auto md:overflow-x-visible no-scrollbar pt-3 pb-3 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                            {availableColors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleColorFilterChange(color)}
                                    aria-label={`Filtra per colore ${color}`}
                                    className={`flex flex-col items-center gap-2 flex-shrink-0 transition-all duration-300 ${
                                        activeColorFilter === color ? 'scale-110' : 'opacity-80'
                                    }`}
                                >
                                    <div 
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all flex items-center justify-center overflow-hidden ${
                                            activeColorFilter === color 
                                                ? 'border-slate-900 ring-4 ring-slate-900/10' 
                                                : 'border-slate-300 hover:border-slate-400'
                                        }`}
                                        style={color !== 'Tutti' ? { backgroundColor: COLOR_MAP[color]?.hex } : { backgroundColor: '#f8fafc' }}
                                    >
                                        {color === 'Tutti' && <Icon name="globe" size={14} className="text-slate-400" />}
                                        {color === 'Trasparente' && <div className="w-full h-full bg-checkerboard opacity-40"></div>}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-tighter ${
                                        activeColorFilter === color ? 'text-slate-900' : 'text-slate-400'
                                    }`}>
                                        {color}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main id="product-grid" className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full scroll-mt-20">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white border-2 border-dashed border-slate-300 rounded-none">
                        <p className="text-slate-400 font-black uppercase tracking-widest">Nessun prodotto trovato per "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery("")} className="mt-4 text-smc-blue font-bold underline">Resetta ricerca</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div 
                                key={product.id}
                                className="bg-white border border-slate-300 group hover:border-smc-blue transition-all hover:shadow-xl flex flex-col relative"
                            >
                                <div 
                                    onClick={() => setSelectedProduct(product)}
                                    className="aspect-[945/760] overflow-hidden relative border-b border-slate-200 cursor-pointer" 
                                    style={{ backgroundColor: '#f1f5f9' }}
                                >
                                    
                                    <ProductImage 
                                        src={smcUtils.getImageUrl(product.id, (activeColorFilter !== "Tutti" && product.colors.includes(activeColorFilter)) ? activeColorFilter : product.colors[0])} 
                                        alt={product.name}
                                        id={product.id}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10"
                                    />

                                    {/* Hover Badges */}
                                    <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                                        <span className="bg-smc-blue text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 shadow-md">
                                            {product.cat}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        <span className="bg-white border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-wider px-2 py-1 shadow-md">
                                            {product.sub}
                                        </span>
                                    </div>
                                </div>
                                
                                <div 
                                    onClick={() => setSelectedProduct(product)}
                                    className="p-4 flex-grow bg-white flex flex-col cursor-pointer"
                                >
                                    <div>
                                        <div className="mb-2">
                                            <p className="text-[10px] font-black text-smc-red uppercase tracking-[0.2em] mb-1">COD. {product.id}</p>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{product.name}</h3>
                                            <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mt-1 leading-relaxed">{product.desc}</p>
                                        </div>
                                        
                                        <div className="space-y-1 mb-2 font-archivo">
                                            {product.specs.split('|').slice(0, 3).map((spec, i) => {
                                                const [label, value] = spec.split(':');
                                                return (
                                                    <div key={i} className="grid grid-cols-[115px_1fr] gap-2 items-baseline border-b border-slate-100 pb-0.5">
                                                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{label?.trim()}:</span>
                                                        <span className="text-[11px] font-bold text-slate-900 truncate">{value?.trim()}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-auto">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">colori:</span>
                                        <div className="flex gap-[3px]">
                                            {product.colors.slice(0, 7).map(c => (
                                                <div 
                                                    key={c} 
                                                    className={`w-[13px] h-[13px] rounded-full border border-slate-400 shadow-sm ${c === 'Trasparente' ? 'bg-checkerboard' : ''}`} 
                                                    style={c !== 'Trasparente' ? { backgroundColor: COLOR_MAP[c]?.hex } : {}} 
                                                    title={c}
                                                ></div>
                                            ))}
                                            {product.colors.length > 7 && <span className="text-[9px] font-bold opacity-40">+{product.colors.length - 7}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 border-t border-slate-200">
                                    <button 
                                        onClick={() => setSelectedProduct(product)}
                                        className="py-3 bg-slate-100 text-smc-blue text-[9px] font-black uppercase tracking-widest hover:bg-smc-blue hover:text-white transition-all flex items-center justify-center gap-1 border-r border-slate-200 rounded-none"
                                    >
                                        Dettagli <Icon name="chevron-right" size={12} />
                                    </button>
                                    <button 
                                        onClick={() => addToQuote(product, (activeColorFilter !== "Tutti" && product.colors.includes(activeColorFilter)) ? activeColorFilter : product.colors[0])}
                                        className="py-3 bg-white text-smc-red text-[9px] font-black uppercase tracking-widest hover:bg-smc-red hover:text-white transition-all flex items-center justify-center gap-1 rounded-none"
                                    >
                                        Preventivo <Icon name="plus" size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProduct(null)}
                        className="fixed inset-0 z-[70] flex items-center justify-center bg-smc-blue/90 backdrop-blur-md p-0 md:p-4 lg:p-8 cursor-pointer"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] shadow-2xl overflow-hidden relative flex flex-col md:flex-row cursor-default"
                        >
                            {/* Close Button - Fixed on mobile, absolute on desktop */}
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                className="fixed md:absolute top-4 right-4 z-[100] w-12 h-12 md:w-10 md:h-10 flex items-center justify-center bg-smc-red text-white hover:bg-smc-blue transition-all shadow-2xl rounded-none"
                                aria-label="Chiudi"
                            >
                                <Icon name="x" size={28} className="md:hidden" />
                                <Icon name="x" size={20} className="hidden md:block" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 relative flex flex-col border-b md:border-b-0 md:border-r border-slate-200 shrink-0" style={{ backgroundColor: '#f1f5f9' }}>
                                <div className="flex-grow flex items-center justify-center">
                                    <div className="w-full h-[30vh] md:h-auto md:aspect-[945/760] relative overflow-hidden flex items-center justify-center p-0">
                                    <AnimatePresence>
                                        <motion.div
                                            key={activeColor}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-full h-full absolute inset-0 z-10 flex items-center justify-center p-0"
                                        >
                                            <ProductImage 
                                                src={smcUtils.getImageUrl(selectedProduct.id, activeColor)} 
                                                alt={selectedProduct.name}
                                                id={selectedProduct.id}
                                                className="w-full h-full object-contain"
                                                loading="eager"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Mobile-only Minimal Badges inside image container */}
                            <div className="md:hidden absolute bottom-0 left-0 z-20 bg-slate-900 text-white px-4 py-2.5 font-black text-[10px] uppercase tracking-widest italic">
                                Art. {selectedProduct.id}
                            </div>
                            <div className="md:hidden absolute bottom-0 right-0 z-20 bg-smc-blue text-white px-4 py-2.5 font-black text-[10px] uppercase tracking-widest">
                                {activeColor}
                            </div>
                            
                            {/* Desktop-only ID Badge */}
                            <div className="hidden md:block w-full bg-slate-50 p-6 border-t border-slate-100 relative overflow-hidden group mt-auto">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-smc-red/5 -rotate-45 translate-x-16 -translate-y-16 transition-transform group-hover:scale-150"></div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Codice Articolo</span>
                                            <p className="text-4xl font-black italic text-smc-red">COD. {selectedProduct.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Variante</span>
                                            <p className="text-lg font-black text-smc-blue uppercase tracking-widest">{activeColor}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="w-full md:w-1/2 flex flex-col h-full md:h-auto overflow-hidden bg-white">
                                <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-8">
                                    <div className="mb-6 md:mb-8">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-smc-red text-white font-black text-[9px] px-2 h-6 inline-flex items-center uppercase tracking-widest leading-none">{selectedProduct.cat}</span>
                                            <span className="bg-slate-100 text-slate-500 font-black text-[9px] px-2 h-6 inline-flex items-center uppercase tracking-widest leading-none">{selectedProduct.sub}</span>
                                            {/* Product Code Badge - Now visible on desktop without "COD." */}
                                            <span className="bg-slate-900 text-white font-black text-[9px] px-2 h-6 inline-flex items-center uppercase tracking-widest italic leading-none">{selectedProduct.id}</span>
                                            <div className="h-px flex-grow bg-slate-100"></div>
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-3 md:mb-4">
                                            {selectedProduct.name}
                                        </h2>
                                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed italic border-l-4 border-smc-red/20 pl-4 md:pl-5 py-1">
                                            {selectedProduct.desc}
                                        </p>
                                    </div>

                                    <div className="space-y-6 md:space-y-4">
                                        {/* Technical Specs */}
                                        <div className="font-archivo">
                                            <h4 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                                                <span className="w-5 h-5 md:w-6 md:h-6 rounded-none bg-smc-red/10 flex items-center justify-center">
                                                    <Icon name="zap" size={10} className="text-smc-red" />
                                                </span>
                                                Specifiche Tecniche
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-1.5">
                                                {(() => {
                                                    const specsArray = selectedProduct.specs.split('|').map(s => {
                                                        const [key, val] = s.split(':');
                                                        return { key: key?.trim(), val: val?.trim(), isLong: (val?.trim().length || 0) > 22 };
                                                    });
                                                    let currentCol = 0;
                                                    return specsArray.map((spec, i) => {
                                                        const nextSpec = specsArray[i + 1];
                                                        const isLast = i === specsArray.length - 1;
                                                        const nextIsLong = nextSpec?.isLong;
                                                        const shouldSpan2 = spec.isLong || (currentCol === 0 && (nextIsLong || isLast));
                                                        currentCol = (currentCol + (shouldSpan2 ? 2 : 1)) % 2;
                                                        return (
                                                            <div key={i} className={`flex justify-between items-center py-1.5 px-3 bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 min-h-[42px] ${shouldSpan2 ? 'sm:col-span-2' : ''}`}>
                                                                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{spec.key}</span>
                                                                <div className="flex justify-end flex-1 ml-6">
                                                                    <span className="text-xs md:text-sm font-black text-slate-900 text-left leading-tight">{spec.val}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>

                                        {/* Color Variants */}
                                        <div>
                                            <h4 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 md:mb-1 flex items-center gap-2 md:gap-3">
                                                <span className="w-5 h-5 md:w-6 md:h-6 rounded-none bg-smc-red/10 flex items-center justify-center">
                                                    <Icon name="palette" size={10} className="text-smc-red" />
                                                </span>
                                                Varianti Colore: <span className="text-smc-blue ml-1">{activeColor}</span>
                                            </h4>
                                            <div className="flex flex-nowrap justify-center md:justify-start gap-3 md:gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pt-2 md:pt-2 pb-2 md:pb-2">
                                                {selectedProduct.colors.map((color, i) => (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => handleColorChange(color)}
                                                        aria-label={`Seleziona colore ${color}`}
                                                        className={`group relative w-[38px] h-[38px] md:w-12 md:h-12 shrink-0 rounded-full border-2 transition-all ${
                                                            activeColor === color 
                                                                ? 'border-smc-red ring-4 ring-smc-red/10 scale-110 z-10 shadow-lg' 
                                                                : 'border-slate-200 hover:border-smc-blue hover:scale-110 md:hover:shadow-[0_0_20px_rgba(0,66,157,0.25)]'
                                                        } ${color === 'Trasparente' ? 'bg-checkerboard' : ''}`}
                                                        style={color !== 'Trasparente' ? { backgroundColor: COLOR_MAP[color]?.hex } : {}}
                                                    >
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Unit & Quantity Selection - Grouped for harmony */}
                                        <div className="hidden md:flex flex-col space-y-2">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 md:mb-4 flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-none bg-smc-red/10 flex items-center justify-center">
                                                        <Icon name="mouse-pointer-2" size={12} className="text-smc-red" />
                                                    </span>
                                                    Scegli confezione o box
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button 
                                                        onClick={() => setSelectedUnit("conf")}
                                                        className={`p-3 border-2 transition-all text-left relative overflow-hidden group rounded-none ${
                                                            selectedUnit === "conf" 
                                                                ? "bg-smc-blue/5 border-smc-blue shadow-lg" 
                                                                : "bg-slate-50 border-slate-100 opacity-60 hover:opacity-100"
                                                        }`}
                                                    >
                                                        {selectedUnit === "conf" && <div className="absolute top-0 right-0 w-8 h-8 bg-smc-blue text-white flex items-center justify-center"><Icon name="check" size={12} /></div>}
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Icon name="shopping-bag" size={18} className={selectedUnit === "conf" ? "text-smc-blue" : "text-slate-400"} />
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confezione</span>
                                                        </div>
                                                        <p className={`text-xl font-black italic ${selectedUnit === "conf" ? "text-smc-blue" : "text-slate-400"}`}>pz {selectedProduct.conf}</p>
                                                    </button>
                                                    <button 
                                                        onClick={() => setSelectedUnit("box")}
                                                        className={`p-3 border-2 transition-all text-left relative overflow-hidden group rounded-none ${
                                                            selectedUnit === "box" 
                                                                ? "bg-smc-red/5 border-smc-red shadow-lg" 
                                                                : "bg-slate-50 border-slate-100 opacity-60 hover:opacity-100"
                                                        }`}
                                                    >
                                                        {selectedUnit === "box" && <div className="absolute top-0 right-0 w-8 h-8 bg-smc-red text-white flex items-center justify-center"><Icon name="check" size={12} /></div>}
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Icon name="package" size={18} className={selectedUnit === "box" ? "text-smc-red" : "text-slate-400"} />
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Box</span>
                                                        </div>
                                                        <p className={`text-xl font-black italic ${selectedUnit === "box" ? "text-smc-red" : "text-slate-400"}`}>pz {selectedProduct.box}</p>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quantity Selector */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 shadow-xl">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0">Quantità</span>
                                                    <span className="text-white font-black text-xs uppercase tracking-widest italic">{selectedUnit === "box" ? "Box Completi" : "Confezioni Singole"}</span>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-6">
                                                    <button 
                                                        onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                                                        className="w-10 h-10 flex items-center justify-center bg-white/10 text-white hover:bg-smc-red transition-all border border-white/10 rounded-none"
                                                    >
                                                        <Icon name="minus" size={16} />
                                                    </button>
                                                    <span className="text-2xl font-black text-white w-10 text-center font-display">{selectedQuantity}</span>
                                                    <button 
                                                        onClick={() => setSelectedQuantity(q => q + 1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white/10 text-white hover:bg-smc-blue transition-all border border-white/10 rounded-none"
                                                    >
                                                        <Icon name="plus" size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2 md:p-4 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                                    {/* Mobile-only ultra-compact controls */}
                                    <div className="md:hidden flex flex-col gap-2">
                                        {/* Unit Toggle - Slimmer */}
                                        <div className="flex bg-slate-100 p-1 rounded-none gap-1">
                                            <button 
                                                onClick={() => setSelectedUnit("conf")}
                                                className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-none border-2 ${
                                                    selectedUnit === "conf" 
                                                        ? "bg-white text-smc-blue border-smc-blue ring-4 ring-smc-blue/10 shadow-sm" 
                                                        : "text-slate-400 border-transparent"
                                                }`}
                                            >
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Icon name="shopping-bag" size={12} className={selectedUnit === "conf" ? "text-smc-blue" : "text-slate-400"} />
                                                    <span>Conf. ({selectedProduct.conf} pz)</span>
                                                </div>
                                            </button>
                                            <button 
                                                onClick={() => setSelectedUnit("box")}
                                                className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-none border-2 ${
                                                    selectedUnit === "box" 
                                                        ? "bg-white text-smc-red border-smc-red ring-4 ring-smc-red/10 shadow-sm" 
                                                        : "text-slate-400 border-transparent"
                                                }`}
                                            >
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Icon name="package" size={12} className={selectedUnit === "box" ? "text-smc-red" : "text-slate-400"} />
                                                    <span>Box ({selectedProduct.box} pz)</span>
                                                </div>
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Quantity Selector - Compact */}
                                            <div className="flex items-center bg-slate-100 p-1 rounded-none shrink-0">
                                                <button 
                                                    onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 active:text-smc-red"
                                                >
                                                    <Icon name="minus" size={18} />
                                                </button>
                                                <span className="w-8 text-center text-lg font-black text-smc-blue">{selectedQuantity}</span>
                                                <button 
                                                    onClick={() => setSelectedQuantity(q => q + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 active:text-smc-blue"
                                                >
                                                    <Icon name="plus" size={18} />
                                                </button>
                                            </div>

                                            {/* Add Button - Integrated */}
                                            <button 
                                                onClick={() => {
                                                    addToQuote(selectedProduct, activeColor, selectedQuantity, selectedUnit);
                                                    setSelectedProduct(null);
                                                    window.location.hash = '#quote';
                                                }}
                                                className="flex-grow py-3 bg-smc-red text-white text-[11px] font-black uppercase tracking-widest italic hover:bg-smc-blue transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] rounded-none"
                                            >
                                                Aggiungi <Icon name="file-text" size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop Button - Original style */}
                                    <button 
                                        onClick={() => {
                                            addToQuote(selectedProduct, activeColor, selectedQuantity, selectedUnit);
                                            setSelectedProduct(null);
                                            window.location.hash = '#quote';
                                        }}
                                        className="hidden md:flex w-full py-3 bg-smc-red text-white text-base font-black uppercase tracking-[0.3em] italic hover:bg-smc-blue transition-all items-center justify-center gap-4 shadow-2xl shadow-smc-red/40 active:scale-[0.98] group rounded-none"
                                    >
                                        Aggiungi al Preventivo <Icon name="arrow-right" size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quote Drawer */}
            <AnimatePresence>
                {isQuoteOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsQuoteOpen(false)}
                            className="fixed inset-0 z-[60] bg-smc-blue/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="py-3 px-6 bg-smc-blue text-white flex items-center justify-between border-b-4 border-smc-red">
                                <div className="flex items-center gap-3">
                                    <Icon name="file-text" className="text-smc-red" />
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Il Tuo Preventivo</h2>
                                </div>
                                <div className="flex items-center gap-1">
                                    {quoteItems.length > 0 && (
                                        <button 
                                            onClick={handleExportToPDF} 
                                            disabled={isPdfGenerating}
                                            className={`p-2 hover:bg-white/10 rounded-none transition-colors flex items-center gap-2 ${isPdfGenerating ? 'text-white/30 cursor-wait' : 'text-white/70 hover:text-white'}`}
                                            title={isPdfGenerating ? "Generazione in corso..." : "Scarica PDF"}
                                        >
                                            {isPdfGenerating ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Icon name="download" size={20} />
                                            )}
                                        </button>
                                    )}
                                    <button onClick={() => setIsQuoteOpen(false)} aria-label="Chiudi preventivo" className="p-2 hover:bg-white/10 rounded-none transition-colors">
                                        <Icon name="x" size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-3 space-y-2">
                                {quoteItems.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                        <Icon name="file-text" size={64} className="mb-4" />
                                        <p className="text-lg font-black uppercase tracking-widest">Il preventivo è vuoto</p>
                                    </div>
                                ) : (
                                    quoteItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 p-2 bg-slate-50 border border-slate-200 group relative rounded-none">
                                            <div className="w-20 h-20 border border-slate-100 p-0.5 shrink-0 relative overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                                                <ProductImage 
                                                    src={smcUtils.getImageUrl(item.product.id, item.color)} 
                                                    alt={item.product.name}
                                                    id={item.product.id}
                                                    className="w-full h-full object-contain"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-smc-red text-white text-[9px] font-black text-center py-0.5 uppercase tracking-tighter">
                                                    Art. {item.product.id}
                                                </div>
                                            </div>
                                            <div className="flex-grow pr-6 flex flex-col justify-between">
                                                <div className="flex flex-col">
                                                    <h4 className="text-sm font-black text-smc-blue uppercase italic leading-[1.1] h-[2.2rem] line-clamp-2 mb-0.5 flex items-start">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                        {item.color} | {item.unit === "box" ? "Box" : "Conf."}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center border border-slate-200 bg-white rounded-none">
                                                        <button onClick={() => updateQuantity(item.id, -1)} aria-label="Diminuisci quantità" className="p-1 hover:bg-slate-100 text-slate-400 rounded-none"><Icon name="minus" size={10} /></button>
                                                        <span className="w-7 text-center text-xs font-black text-smc-blue">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} aria-label="Aumenta quantità" className="p-1 hover:bg-slate-100 text-slate-400 rounded-none"><Icon name="plus" size={10} /></button>
                                                    </div>
                                                    <span className="text-[10px] font-black text-smc-red uppercase italic">
                                                        T. pz: {item.unit === "box" ? item.quantity * item.product.box : item.quantity * item.product.conf}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeFromQuote(item.id)} 
                                                aria-label="Rimuovi articolo dal preventivo"
                                                className="absolute top-2 right-2 text-slate-300 hover:text-smc-red transition-colors rounded-none p-1"
                                            >
                                                <Icon name="trash-2" size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {quoteItems.length > 0 && (
                                <div className="py-2 px-4 bg-slate-50 border-t border-slate-200 space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Articoli totali</span>
                                        <span className="text-xl font-black text-smc-blue italic">{quoteItems.length}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        <a 
                                            href={smcUtils.generateWhatsAppLink(quoteItems)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-2.5 bg-green-600 text-white text-center text-sm font-black uppercase tracking-[0.2em] italic hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
                                        >
                                            Invia su WhatsApp <Icon name="message-circle" size={18} />
                                        </a>
                                        <a 
                                            href={smcUtils.generateEmailLink(quoteItems)}
                                            className="w-full py-2.5 bg-smc-blue text-white text-center text-sm font-black uppercase tracking-[0.2em] italic hover:bg-smc-red transition-all flex items-center justify-center gap-3 shadow-lg shadow-smc-blue/20"
                                        >
                                            Invia tramite Email <Icon name="mail" size={18} />
                                        </a>
                                    </div>
                                    <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest leading-tight">
                                        Riceverai una risposta con prezzi e disponibilità
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Features Divider - Ultra-refined dark burgundy bar */}
            <div className="bg-[#2d0a0c] text-white/90 py-4 md:py-5 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 md:gap-2">
                        <div className="flex flex-row items-center justify-start md:justify-center gap-2.5 group text-left">
                            <div className="p-1.5 bg-white/5 rounded-none group-hover:bg-smc-red/20 transition-colors shrink-0">
                                <Icon name="shield-check" size={20} className="text-smc-red" />
                            </div>
                            <p className="text-[8px] font-bold uppercase tracking-widest leading-tight">Conformità<br/>CEI 23-50</p>
                        </div>
                        <div className="flex flex-row items-center justify-start md:justify-center gap-2.5 group text-left">
                            <div className="p-1.5 bg-white/5 rounded-none group-hover:bg-smc-red/20 transition-colors shrink-0">
                                <Icon name="truck" size={20} className="text-smc-red" />
                            </div>
                            <p className="text-[8px] font-bold uppercase tracking-widest leading-tight">Spedizione in Italia<br/>e Unione Europea</p>
                        </div>
                        <div className="flex flex-row items-center justify-start md:justify-center gap-2.5 group text-left">
                            <div className="p-1.5 bg-white/5 rounded-none group-hover:bg-smc-red/20 transition-colors shrink-0">
                                <Icon name="zap" size={20} className="text-smc-red" />
                            </div>
                            <p className="text-[8px] font-bold uppercase tracking-widest leading-tight">Tecnopolimero<br/>Alta Resistenza</p>
                        </div>
                        <div className="flex flex-row items-center justify-start md:justify-center gap-2.5 group text-left">
                            <div className="p-1.5 bg-white/5 rounded-none group-hover:bg-smc-red/20 transition-colors shrink-0">
                                <Icon name="headphones" size={20} className="text-smc-red" />
                            </div>
                            <p className="text-[8px] font-bold uppercase tracking-widest leading-tight">Assistenza<br/>Dedicata</p>
                        </div>
                    </div>
                </div>
            </div>

            </main>

            {/* Footer - SMC Tech-Grid Industrial Design */}
            <footer 
                id="contacts"
                className="bg-smc-blue text-white pt-8 pb-24 md:pb-12 border-t-4 border-smc-red relative overflow-hidden"
                style={{ contentVisibility: 'auto' }}
            >
                {/* Background Effects - Matching Hero Header */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Technical Grid Overlay - With Visible Pulse Animation */}
                    <motion.div 
                        animate={{ opacity: [0.05, 0.17, 0.05] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0" 
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                    ></motion.div>
                    
                    {/* Scanning Red Laser Line - Subtle & Technical */}
                    <motion.div 
                        animate={{ x: ['-10vw', '110vw'] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-[1px] bg-smc-red/30 shadow-[0_0_10px_rgba(239,68,68,0.3)] blur-[0.5px] will-change-transform z-0"
                    />

                    {/* Subtle Radial Glow */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.05)_0%,transparent_50%)]"></div>
                    
                    {/* Background Brand Watermark - Logo Version */}
                    <div className="absolute -bottom-10 -right-10 w-[40vw] opacity-[0.02] select-none pointer-events-none grayscale brightness-[10] contrast-[10] will-change-[filter]">
                        <img 
                            src="./logo.png" 
                            alt="" 
                            className="w-full h-auto object-contain"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                        />
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Top Action Bar - Contacts with Glassmorphism */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center gap-5 group hover:bg-white/10 transition-colors relative overflow-hidden will-change-transform">
                            <div className="absolute top-0 left-0 w-1 h-full bg-smc-red scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                            <div className="w-12 h-12 flex items-center justify-center bg-smc-red shadow-[0_0_20px_rgba(239,68,68,0.4)] shrink-0">
                                <Icon name="phone" size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/40 mb-1">System.Contact / Voice</p>
                                <p className="text-sm font-black tracking-widest">+39 366 24 81 736</p>
                            </div>
                        </div>
                        <a href="https://wa.me/393662481736" target="_blank" rel="noopener noreferrer" 
                           className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center gap-5 group hover:bg-[#25D366]/10 transition-colors relative overflow-hidden will-change-transform">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#25D366] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                            <div className="w-12 h-12 flex items-center justify-center bg-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.4)] shrink-0">
                                <Icon name="message-circle" size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/40 mb-1">Network.WhatsApp / Business</p>
                                <p className="text-sm font-black tracking-widest uppercase">Chat Online</p>
                            </div>
                        </a>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center gap-5 group hover:bg-smc-red/10 transition-colors relative overflow-hidden will-change-transform">
                            <div className="absolute top-0 left-0 w-1 h-full bg-smc-red scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                            <div className="w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 group-hover:bg-smc-red group-hover:border-smc-red transition-colors shrink-0">
                                <Icon name="mail" size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/40 mb-1">Data.Transfer / Email</p>
                                <p className="text-sm font-black tracking-widest uppercase truncate">scribani.mary@live.it</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Brand Section - Unified Tech Box */}
                        <div className="lg:col-span-5 flex">
                            <div className="bg-smc-blue p-8 border border-white/10 w-full flex flex-col justify-between">
                                <img 
                                    src="./logo.png" 
                                    alt="SMC Logo" 
                                    className="h-14 w-auto object-contain mb-8"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                                <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                                    <div className="flex h-[22px] w-[32px] border border-white/20 relative overflow-hidden shrink-0">
                                        <div className="w-[10px] h-full bg-[#008C45]"></div>
                                        <div className="w-[10px] h-full bg-[#F4F5F0]"></div>
                                        <div className="w-[10px] h-full bg-[#CD212A]"></div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em]">
                                            <span className="text-white">Eccellenza</span> <span className="text-smc-red italic">Italiana</span>
                                        </div>
                                        <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Origin: 41.0122° N, 14.1784° E</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Section - Technical Grid Layout */}
                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            {/* Vertical Divider with Node */}
                            <div className="hidden lg:block absolute left-[-3rem] top-0 bottom-0 w-px bg-gradient-to-b from-smc-red/50 via-white/10 to-transparent">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-smc-red shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-smc-red"></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sede Operativa</h4>
                                </div>
                                <div className="space-y-3 pl-4 border-l border-white/5">
                                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">Via G.Rossini 4</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">81033 Casal di Principe (CE)</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest italic">Campania Region / IT</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-smc-red"></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Dati Societari</h4>
                                </div>
                                <div className="space-y-3 pl-4 border-l border-white/5">
                                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-smc-red">P.IVA 04460430616</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">SMC Scribani S.R.L.</p>
                                    <div className="pt-4">
                                        <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">© 2026 Build.v2.4.0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Technical Bar - Enhanced */}
                    <div className="mt-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-8 relative">
                        <div className="absolute top-0 left-0 w-20 h-px bg-smc-red"></div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                <div className="w-1 h-3 bg-smc-red/40"></div>
                                <div className="w-1 h-3 bg-smc-red/60"></div>
                                <div className="w-1 h-3 bg-smc-red animate-pulse"></div>
                            </div>
                            <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-white/30">
                                Status: Operational / Quality.Checked
                            </p>
                        </div>
                        <div className="flex gap-10">
                            {['Reliability', 'Precision', 'Innovation'].map((word) => (
                                <div key={word} className="flex flex-col items-end group cursor-default">
                                    <span className="text-[9px] uppercase font-black tracking-[0.4em] text-white/20 group-hover:text-smc-red transition-all">
                                        {word}
                                    </span>
                                    <div className="h-px w-0 group-hover:w-full bg-smc-red transition-all duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            {!selectedProduct && (
                <React.Fragment>
                    <AnimatePresence>
                        {isFilterMenuOpen && (
                            <React.Fragment>
                                {/* Backdrop to close menu on click outside */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsFilterMenuOpen(false)}
                                    className="md:hidden fixed inset-0 bg-black/20 z-30"
                                />
                                
                                <motion.div 
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 10, opacity: 0 }}
                                    className="md:hidden fixed bottom-[60px] left-2 right-2 bg-smc-blue/95 backdrop-blur-xl border border-white/10 z-40 p-4 shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">Categorie</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => handleCategoryChange(cat)}
                                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                            activeCategory === cat 
                                                                ? 'bg-smc-red border-smc-red text-white' 
                                                                : 'bg-white/5 border-white/10 text-white/60'
                                                        }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Sottocategorie</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {subCategories.map(sub => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => handleSubCategoryChange(sub)}
                                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                            activeSubCategory === sub 
                                                                ? 'bg-white border-white text-smc-blue' 
                                                                : 'bg-white/5 border-white/10 text-white/50'
                                                        }`}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Colori</p>
                                            <div className="flex flex-nowrap gap-2.5 overflow-x-auto no-scrollbar pb-1">
                                                {availableColors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorFilterChange(color)}
                                                        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center overflow-hidden ${
                                                            activeColorFilter === color 
                                                                ? 'border-white ring-2 ring-white/20' 
                                                                : 'border-white/10 hover:border-white/30'
                                                        }`}
                                                        style={color !== 'Tutti' ? { backgroundColor: COLOR_MAP[color]?.hex } : { backgroundColor: 'rgba(255,255,255,0.1)' }}
                                                    >
                                                        {color === 'Tutti' ? (
                                                            <span className="text-[7px] font-black text-white uppercase">All</span>
                                                        ) : color === 'Trasparente' ? (
                                                            <div className="w-full h-full bg-checkerboard opacity-40"></div>
                                                        ) : null}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => setIsFilterMenuOpen(false)}
                                            className="w-full py-2.5 bg-white text-smc-blue text-[9px] font-black uppercase tracking-widest"
                                        >
                                            Chiudi Filtri
                                        </button>
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        )}
                    </AnimatePresence>

                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-smc-blue border-t border-white/10 z-50 p-2 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                        <div className="flex-[1.4] relative h-10">
                            <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                                <Icon name="search" size={12} className="text-white/40" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Cerca prodotti..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-full bg-white/10 border border-white/20 rounded-none pl-8 pr-2 text-xs text-white focus:bg-white focus:text-smc-blue focus:outline-none transition-all placeholder:text-white/40"
                            />
                        </div>
                        
                        <button 
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`flex-1 h-10 flex items-center justify-center gap-2 border transition-all ${
                                isFilterMenuOpen || activeCategory !== "Tutti" || activeSubCategory !== "Tutte"
                                    ? 'bg-white border-white text-smc-blue'
                                    : 'bg-white/5 border-white/20 text-white'
                            }`}
                        >
                            <Icon name="filter" size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Filtri</span>
                        </button>

                        <button 
                            onClick={() => setIsQuoteOpen(true)}
                            className="bg-smc-red text-white h-10 px-3 rounded-none flex items-center justify-center gap-2 relative transition-transform active:scale-95"
                        >
                            <Icon name="file-text" size={18} />
                            <span className="text-[9px] font-black uppercase tracking-widest hidden xs:block">Preventivo</span>
                            {quoteItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-smc-red text-[9px] font-black min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center rounded-none border border-smc-red">
                                    {quoteItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

