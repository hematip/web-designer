import { useEffect, useState } from 'react';
import { House, ChartColumn, Plus, Scale, UserRound } from 'lucide-react';
import { init, useStore, getUser, get, getSyncState } from './lib/store.ts';
import { closeSheet, goTab, openSheet, useSheet, useTab, type Tab } from './lib/nav.ts';
import { Auth } from './screens/Auth.tsx';
import { Onboarding } from './screens/Onboarding.tsx';
import { Today } from './screens/Today.tsx';
import { Body } from './screens/Body.tsx';
import { Reports } from './screens/Reports.tsx';
import { Me, BudgetSheet, InstallSheet, PasswordSheet, DeleteAccountSheet } from './screens/Me.tsx';
import { AddFoodSheet, EditFoodSheet } from './screens/FoodSheets.tsx';
import { ActivitySheet, AddMenuSheet, StepsSheet, WeightSheet } from './screens/OtherSheets.tsx';
import { ToastHost } from './ui/kit.tsx';
import { Mascot } from './ui/Mascot.tsx';
import { BRAND } from './brand.ts';

const TABS: { id: Tab; label: string; icon: typeof House }[] = [
  { id: 'today', label: 'امروز', icon: House },
  { id: 'reports', label: 'گزارش', icon: ChartColumn },
  { id: 'body', label: 'بدن', icon: Scale },
  { id: 'me', label: 'من', icon: UserRound },
];

function SheetHost() {
  const s = useSheet();
  if (!s) return null;
  switch (s.kind) {
    case 'add-menu':
      return <AddMenuSheet />;
    case 'add-food':
      return <AddFoodSheet key={`${s.date}-${s.meal}`} date={s.date} meal={s.meal} />;
    case 'edit-food':
      return <EditFoodSheet key={s.id} id={s.id} />;
    case 'add-activity':
      return <ActivitySheet date={s.date} />;
    case 'edit-activity':
      return <ActivitySheet key={s.id} editId={s.id} />;
    case 'weight':
      return <WeightSheet key={s.date} date={s.date} />;
    case 'steps':
      return <StepsSheet key={s.date} date={s.date} />;
    case 'budget':
      return <BudgetSheet />;
    case 'install':
      return <InstallSheet />;
    case 'password':
      return <PasswordSheet />;
    case 'delete-account':
      return <DeleteAccountSheet />;
    default:
      return null;
  }
}

function Shell() {
  const tab = useTab();
  const sheet = useSheet();
  if (sheet?.kind === 'plan') {
    return <Onboarding editing onDone={closeSheet} />;
  }
  const add = (
    <button type="button" className="add" onClick={() => openSheet({ kind: 'add-menu' })} aria-label="ثبت جدید">
      <Plus size={30} strokeWidth={3.2} />
      <span className="desk-only">ثبت جدید</span>
    </button>
  );
  return (
    <>
    <div className="app" inert={!!sheet}>
      <nav className="nav" aria-label="بخش‌ها">
        <div className="side-brand">
          <Mascot size={44} mood="happy" />
          <span className="display" style={{ fontSize: 28 }}>
            {BRAND.name}
          </span>
        </div>
        <ul>
          {TABS.slice(0, 2).map((t) => (
            <NavItem key={t.id} t={t} active={tab === t.id} />
          ))}
          <li className="add-li">{add}</li>
          {TABS.slice(2).map((t) => (
            <NavItem key={t.id} t={t} active={tab === t.id} />
          ))}
        </ul>
      </nav>
      <main className="main" id="main">
        {tab === 'today' && <Today />}
        {tab === 'reports' && <Reports />}
        {tab === 'body' && <Body />}
        {tab === 'me' && <Me />}
      </main>
    </div>
    <SheetHost />
    </>
  );
}

function NavItem({ t, active }: { t: (typeof TABS)[number]; active: boolean }) {
  const Icon = t.icon;
  return (
    <li>
      <a
        href={`#/${t.id}`}
        aria-current={active ? 'page' : undefined}
        onClick={(e) => {
          e.preventDefault();
          goTab(t.id);
        }}
      >
        <Icon size={26} strokeWidth={2.4} aria-hidden="true" />
        {t.label}
      </a>
    </li>
  );
}

export function App() {
  useStore();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    init().finally(() => setReady(true));
  }, []);
  const user = getUser();
  const profile = get('profile', 'me');
  const sheet = useSheet();

  useEffect(() => {
    if (!user && sheet) closeSheet();
  }, [user, sheet]);

  let content;
  if (!ready) content = <div className="center-page" aria-busy="true"><div style={{ display: 'grid', placeItems: 'center' }}><Mascot size={120} mood="sleepy" bob /></div></div>;
  else if (!user) content = <Auth />;
  else if (getSyncState() === 'auth') content = <Auth reason="expired" />;
  else if (!profile) content = <OnboardingGate />;
  else content = <Shell />;

  return (
    <>
      {content}
      <ToastHost />
    </>
  );
}

/** After sign-in we try one sync first, so a returning user on a new phone skips onboarding. */
function OnboardingGate() {
  useStore();
  const state = getSyncState();
  if (state === 'syncing') {
    return (
      <div className="center-page" aria-busy="true">
        <div style={{ display: 'grid', placeItems: 'center', gap: 12 }}>
          <Mascot size={110} mood="chew" bob />
          <p style={{ fontWeight: 700 }}>دارم اطلاعاتتون رو میارم…</p>
        </div>
      </div>
    );
  }
  return <Onboarding onDone={() => goTab('today')} />;
}
