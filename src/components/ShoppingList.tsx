import { useEffect, useState } from "preact/hooks";
import {
  mergeShoppingItem,
  validateShoppingList,
  type ShoppingItem,
} from "../lib/shopping";
const KEY = "foodlab:shopping:v1";
const id = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]),
    [name, setName] = useState(""),
    [qty, setQty] = useState(""),
    [unit, setUnit] = useState(""),
    [undo, setUndo] = useState<ShoppingItem[] | null>(null),
    [message, setMessage] = useState(""),
    [importList, setImportList] = useState<ShoppingItem[] | null>(null);
  useEffect(() => {
    try {
      const v = validateShoppingList(
        JSON.parse(localStorage.getItem(KEY) ?? "[]"),
      );
      if (v) setItems(v);
    } catch {
      setMessage("Не вдалося прочитати збережений список.");
    }
    const handler = (event: Event) => {
      const d = (
        event as CustomEvent<{
          recipeId: string;
          recipeName: string;
          name: string;
          quantity: number;
          unit: string;
          category: string;
        }>
      ).detail;
      setItems((v) =>
        mergeShoppingItem(v, {
          id: id(),
          ...d,
          purchased: false,
          sources: [
            {
              recipeId: d.recipeId,
              recipeName: d.recipeName,
              quantity: d.quantity,
              unit: d.unit,
            },
          ],
        }),
      );
    };
    window.addEventListener("foodlab:shopping-add", handler);
    const hash = location.hash.slice(1);
    if (hash.startsWith("list=")) {
      try {
        const data = JSON.parse(
          new TextDecoder().decode(
            Uint8Array.from(atob(hash.slice(5)), (c) => c.charCodeAt(0)),
          ),
        );
        const valid = validateShoppingList(data);
        if (valid) {
          setImportList(valid);
          setMessage("Знайдено список для імпорту.");
        }
      } catch {
        setMessage("Посилання містить некоректний список.");
      }
    }
    return () => window.removeEventListener("foodlab:shopping-add", handler);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      setMessage("Не вдалося зберегти список у цьому браузері.");
    }
  }, [items]);
  const add = (n = name, q = qty, u = unit) => {
    if (!n.trim()) return;
    const incoming = {
      id: id(),
      name: n.trim(),
      quantity: q ? Number(q) : null,
      unit: u,
      category: "Інше",
      purchased: false,
      sources: [],
    };
    setItems((v) => mergeShoppingItem(v, incoming));
    setName("");
    setQty("");
    setUnit("");
  };
  const text = () =>
    `Список покупок\n` +
    items
      .map(
        (x) =>
          `${x.purchased ? "[x]" : "[ ]"} ${x.name}${x.quantity !== null ? ` — ${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(x.quantity)} ${x.unit}` : ""}`,
      )
      .join("\n");
  const share = async () => {
    try {
      await navigator.share({ title: "Список покупок", text: text() });
    } catch {
      setMessage("Поширення скасовано або недоступне.");
    }
  };
  const copy = async () => {
    await navigator.clipboard.writeText(text());
    setMessage("Список скопійовано.");
  };
  const copyLink = async () => {
    const bytes = new TextEncoder().encode(JSON.stringify(items));
    const encoded = btoa(String.fromCharCode(...bytes));
    await navigator.clipboard.writeText(
      `${location.origin}${location.pathname}#list=${encoded}`,
    );
    setMessage("Посилання скопійовано.");
  };
  const remove = (item: ShoppingItem) => {
    setUndo(items);
    setItems((v) => v.filter((x) => x.id !== item.id));
  };
  return (
    <section class="shopping">
      <h1>Список покупок</h1>
      <p>
        {items.filter((x) => x.purchased).length} з {items.length} придбано
      </p>
      {message && (
        <p role="status">
          {message}
          {importList && (
            <button
              onClick={() => {
                setItems((v) => [
                  ...v,
                  ...importList.filter((x) => !v.some((y) => y.id === x.id)),
                ]);
                setImportList(null);
                setMessage("");
              }}
            >
              Імпортувати
            </button>
          )}
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          aria-label="Назва товару"
          placeholder="Назва товару"
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <input
          aria-label="Кількість"
          placeholder="Кількість"
          inputMode="decimal"
          value={qty}
          onInput={(e) => setQty(e.currentTarget.value)}
        />
        <input
          aria-label="Одиниця"
          placeholder="г, мл, шт."
          value={unit}
          onInput={(e) => setUnit(e.currentTarget.value)}
        />
        <button>Додати</button>
      </form>
      <ul>
        {[
          ...items.filter((x) => !x.purchased),
          ...items.filter((x) => x.purchased),
        ].map((item) => (
          <li class={item.purchased ? "purchased" : ""}>
            <label>
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={(e) =>
                  setItems((v) =>
                    v.map((x) =>
                      x.id === item.id
                        ? { ...x, purchased: e.currentTarget.checked }
                        : x,
                    ),
                  )
                }
              />
              <span>{item.name}</span>
            </label>
            <strong>
              {item.quantity !== null ? `${item.quantity} ${item.unit}` : ""}
            </strong>
            <button
              onClick={() => remove(item)}
              aria-label={`Видалити ${item.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {undo && (
        <button
          onClick={() => {
            setItems(undo);
            setUndo(null);
          }}
        >
          Скасувати видалення
        </button>
      )}
      <div class="shopping-actions">
        <button onClick={share}>Поділитися</button>
        <button onClick={copyLink}>Копіювати посилання</button>
        <button onClick={copy}>Копіювати текст</button>
        <button
          onClick={() => {
            if (confirm("Очистити весь список покупок?")) setItems([]);
          }}
        >
          Очистити список
        </button>
        <button onClick={() => setItems((v) => v.filter((x) => !x.purchased))}>
          Очистити придбане
        </button>
      </div>
    </section>
  );
}
