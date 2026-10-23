# Školní SketchForge na GitHub Pages

Web: **https://martinbenes.github.io/sketchforge-skola/**

## Práce ve škole

1. Otevřít web a zvolit **4.–5. ročník** nebo **Plný editor**. Prohlížeč si volbu zapamatuje.
2. Vytvořit projekt a modelovat.
3. Před koncem hodiny ve školním režimu kliknout na **Uložit práci**. Stažený soubor **`.skf`** ručně nahrát na Google Drive.
4. Příště stáhnout SKF z Disku a kliknout na **Otevřít práci**. V plném editoru jsou stejné možnosti v nabídce importu a exportu.
5. Pro přípravu tisku kliknout na **Pro 3D tisk**. Stažené **`.stl`** otevřít ve sliceru a připravit pro konkrétní tiskárnu.

SKF uchovává upravitelný projekt, STL je určené k předání modelu pro tisk. Projekty se průběžně ukládají do úložiště prohlížeče, ale na jiném počítači ani po vymazání dat prohlížeče se samy neobjeví. Pravidelně ukládejte SKF. Data z původní lokální adresy `localhost:3000` se na novou webovou adresu nepřenesou automaticky; přeneste je přes SKF.

GitHub Pages poskytuje soubory aplikace. Neobsahuje společné úložiště prací, přihlášení žáků ani přímé připojení ke Google Drive. Serverové API a knihovna sdílených projektů jsou v této variantě vypnuté. Základní modelování, práce se soubory, výpočty geometrie i export běží v prohlížeči.

## Nasazení a aktualizace

Používáme dva oddělené repozitáře:

- **Soukromý `MartinBenes/sketchforge-skola-dev`** obsahuje průběžný vývoj a jeho úplnou historii.
- **Veřejný [MartinBenes/sketchforge-skola](https://github.com/MartinBenes/sketchforge-skola)** obsahuje kompletní zdrojové kódy každé vydané verze a poskytuje GitHub Pages. Jeho historie začíná prvním zveřejněným stavem a pokračuje dalšími vydáními; průběžné vývojové commity se sem neposílají.

Větve jednoho repozitáře nemají samostatnou viditelnost, proto vývoj neskrýváme ve větvi veřejného repozitáře. Zveřejňuje se pouze obsah vybraného otestovaného commitu, nikoli historie soukromého repozitáře. Odkaz na zdrojové kódy je přístupný všem uživatelům aplikace.

Ve veřejném repozitáři v **Settings → Pages → Build and deployment** zvolte **Source: GitHub Actions**. Workflow [Deploy school edition to GitHub Pages](../.github/workflows/pages.yml) se spouští při změně jeho větve `main` nebo ručně přes **Actions → Run workflow** na větvi `main`. Podmínka ve workflow zabrání nasazení ze soukromého vývojového repozitáře.

Workflow nainstaluje závislosti, ověří TypeScript a jednotkové testy, vytvoří statický web a zveřejní ho. Průběh a výslednou adresu ukazuje karta **Actions**. Neúspěšná kontrola nebo sestavení nezveřejní novou verzi. Běžná aktualizace aplikace nevymazává projekty uložené v prohlížeči; zálohy SKF se přesto hodí před větší změnou.

Cesta webu se bere z nastavení Pages, takže funguje i projektová adresa s `/sketchforge-skola/`. Proměnná `NEXT_PUBLIC_SOURCE_CODE_URL` ve workflow nastavuje odkaz na přesný commit veřejného repozitáře, ze kterého se web sestavuje. Licenci a původní oznámení zachovejte i při dalších úpravách.

Původní workflow pro publikování Dockeru a desktopových balíčků se v tomto repozitáři automaticky nespouštějí; lze je spustit ručně. Nasazování původního webu na Cloudflare je omezené na původní repozitář.

### Zveřejnění nové verze

Změny nejprve uložte do commitu soukromého repozitáře a ověřte kontroly i statické sestavení. Pomocí `git archive` připravte obsah vybraného commitu bez adresáře `.git` a bez jeho historie:

```sh
git archive --format=tar --output=/tmp/sketchforge-skola-release.tar HEAD
```

Pro první vydání rozbalte archiv do nového prázdného adresáře a vytvořte v něm nový Git repozitář. Pro další vydání použijte samostatný čistý klon **veřejného** repozitáře a nahraďte jeho pracovní soubory obsahem archivu; ponechte jeho vlastní `.git`. Přeneste také odstranění souborů, aby nezůstaly staré části aplikace. Před commitem zkontrolujte celý diff, zachování licence a absenci soukromých údajů. Nový commit s popisem vydání odešlete do veřejné větve `main`; tím se spustí nasazení.

Soukromý repozitář ani jeho větve nepřipojujte do veřejného pomocí merge a neposílejte jeho historii přes `git push --mirror` nebo `git push --all`. Veřejné vydání musí obsahovat všechny zdrojové soubory a podklady potřebné pro sestavení aplikace, včetně školních úprav, workflow a dokumentace. Závislosti `node_modules`, sestavené soubory a lokální data projektů nejsou součástí zdrojového archivu.

## Místní kontrola statického sestavení

Potřebujete Node.js 22. V kořenovém adresáři projektu spusťte:

```sh
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci
npm run ci
NEXT_PUBLIC_BASE_PATH=/sketchforge-skola \
NEXT_PUBLIC_SOURCE_CODE_URL=https://github.com/MartinBenes/sketchforge-skola \
npm run export
```

Příkazy výše používají zápis proměnných pro macOS a Linux. V PowerShellu je nastavte pomocí `$env:NAZEV="hodnota"` před spuštěním příkazu.

Výsledný web je v `apps/web/out`. Pro nasazení pod jinou cestou sestavte znovu se správnou hodnotou `NEXT_PUBLIC_BASE_PATH`; pro kořen domény ji vynechte. Náhled musí soubory servírovat pod stejnou cestou jako sestavení. Samotné otevření `index.html` přes `file://` nenahrazuje webový server.
