import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Info,
  MessagesSquare,
  ScrollText,
  UserRound,
} from 'lucide-react';
import { Page } from '@/components/common/Page';
import { validateCharacterDraftFields, CHARACTER_LIMITS } from '@/types';
import type { CharacterValidationError } from '@/types';
import { VALIDATION_MESSAGES } from '@/features/characterCreator/messages';
import { createEmptyForm, CREATOR_STEPS } from '@/features/characterCreator/types';
import type { CharacterFormState, CreatorStepId } from '@/features/characterCreator/types';
import { BasicInfoSection } from '@/features/characterCreator/components/BasicInfoSection';
import { PersonalitySection } from '@/features/characterCreator/components/PersonalitySection';
import { StorySection } from '@/features/characterCreator/components/StorySection';
import { ConversationSection } from '@/features/characterCreator/components/ConversationSection';
import { CharacterPreviewCard } from '@/features/characterCreator/components/CharacterPreviewCard';
import { cn } from '@/utils/cn';

const stepIcons: Record<CreatorStepId, React.ReactNode> = {
  basic: <UserRound className="h-4 w-4" />,
  personality: <SparkleIcon />,
  story: <ScrollText className="h-4 w-4" />,
  conversation: <MessagesSquare className="h-4 w-4" />,
};

function SparkleIcon() {
  return <Info className="h-4 w-4" />;
}

/** Campos que valida cada paso, para los indicadores de completado. */
const stepFields: Record<CreatorStepId, Array<keyof CharacterFormState>> = {
  basic: ['name', 'description', 'category'],
  personality: ['personality'],
  story: ['backstory'],
  conversation: ['greeting'],
};

interface FieldErrorsWithCategory {
  [field: string]: string | undefined;
  name?: string;
  description?: string;
  category?: string;
  tags?: string;
  imageUrl?: string;
  personality?: string;
  backstory?: string;
  greeting?: string;
}

function computeErrors(form: CharacterFormState): FieldErrorsWithCategory {
  const codes = validateCharacterDraftFields(form);
  const messages: FieldErrorsWithCategory = {};
  (Object.keys(codes) as Array<keyof typeof codes>).forEach((field) => {
    const code = codes[field] as CharacterValidationError | undefined;
    if (code) {
      messages[field as keyof FieldErrorsWithCategory] = VALIDATION_MESSAGES[code];
    }
  });
  return messages;
}

export default function CreateCharacterPage() {
  const [form, setForm] = useState<CharacterFormState>(createEmptyForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [touchedSteps, setTouchedSteps] = useState<Set<CreatorStepId>>(new Set());
  const stepAnchorRef = useRef<HTMLDivElement>(null);

  const step = CREATOR_STEPS[stepIndex];
  const isLastStep = stepIndex === CREATOR_STEPS.length - 1;

  const errors = useMemo(() => computeErrors(form), [form]);

  const dirty = useMemo(
    () =>
      form.name !== '' ||
      form.description !== '' ||
      form.category !== ('' as CharacterFormState['category']) ||
      form.personality !== '' ||
      form.backstory !== '' ||
      form.greeting !== '' ||
      form.tags.length > 0 ||
      form.traits.length > 0 ||
      form.interests.length > 0 ||
      form.likes.length > 0 ||
      form.dislikes.length > 0 ||
      form.relationships.length > 0 ||
      form.temperament !== '' ||
      form.communicationStyle !== '' ||
      form.toneOfVoice !== '' ||
      form.background !== '' ||
      form.worldDescription !== '' ||
      form.occupation !== '' ||
      form.responseStyle !== '' ||
      form.characterInstructions !== '' ||
      form.conversationGuidelines !== '' ||
      form.imageUrl !== '' ||
      form.bannerUrl !== '' ||
      form.exampleDialogues.length > 0,
    [form]
  );

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = <K extends keyof CharacterFormState>(field: K, value: CharacterFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (index: number) => {
    setTouchedSteps((prev) => new Set(prev).add(CREATOR_STEPS[stepIndex].id));
    setStepIndex(index);
    stepAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stepFieldsWithError = (id: CreatorStepId): string[] =>
    stepFields[id].filter(
      (field) => !!errors[field as keyof FieldErrorsWithCategory]
    );

  const stepComplete = (id: CreatorStepId): boolean => {
    const requiredFilled = stepFields[id].every((field) => {
      const value = form[field];
      if (field === 'category') return value !== ('' as CharacterFormState['category']);
      if (typeof value === 'string') return value.trim() !== '';
      return true;
    });
    return requiredFilled && stepFieldsWithError(id).length === 0;
  };

  const progress = Math.round(
    (CREATOR_STEPS.filter((s) => stepComplete(s.id)).length / CREATOR_STEPS.length) * 100
  );

  const renderSection = () => {
    switch (step.id) {
      case 'basic':
        return <BasicInfoSection form={form} errors={errors} update={update} />;
      case 'personality':
        return <PersonalitySection form={form} errors={errors} update={update} />;
      case 'story':
        return <StorySection form={form} errors={errors} update={update} />;
      case 'conversation':
        return <ConversationSection form={form} errors={errors} update={update} />;
    }
  };

  const preview = <CharacterPreviewCard form={form} />;

  return (
    <Page className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Crear personaje
        </h1>
        <p className="text-sm leading-relaxed text-neutral-400">
          Diseña tu personaje paso a paso: su identidad, su personalidad, su historia y cómo
          conversa. Todo se puede editar antes de guardarlo.
        </p>
      </header>

      <div ref={stepAnchorRef} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-neutral-400">
            Paso {stepIndex + 1} de {CREATOR_STEPS.length}: {step.label}
          </p>
          <p className="text-xs font-medium tabular-nums text-emerald-400">{progress}%</p>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del creador"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <nav aria-label="Secciones del creador" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CREATOR_STEPS.map((s, index) => {
            const complete = stepComplete(s.id);
            const hasErrors = stepFieldsWithError(s.id).length > 0;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToStep(index)}
                aria-current={s.id === step.id ? 'step' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition active:scale-95',
                  s.id === step.id
                    ? 'bg-emerald-600 text-white'
                    : hasErrors
                      ? 'border border-red-500/40 bg-neutral-900 text-red-400'
                      : complete
                        ? 'border border-emerald-500/40 bg-neutral-900 text-emerald-400'
                        : 'border border-neutral-800 bg-neutral-900 text-neutral-400'
                )}
              >
                {complete && s.id !== step.id ? <Check className="h-3.5 w-3.5" /> : stepIcons[s.id]}
                {s.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <section
          aria-label={step.label}
          className="flex flex-col gap-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6"
        >
          {renderSection()}

          <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-4">
            <button
              type="button"
              onClick={() => goToStep(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="flex min-h-11 items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-neutral-200 transition active:scale-95 disabled:opacity-40 md:hover:border-neutral-500 md:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Regresar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex min-h-11 items-center gap-2 rounded-full border border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-200 transition active:scale-95 md:hidden"
              >
                <Eye className="h-4 w-4" />
                Vista previa
              </button>
              {!isLastStep && (
                <button
                  type="button"
                  onClick={() => goToStep(Math.min(CREATOR_STEPS.length - 1, stepIndex + 1))}
                  className="flex min-h-11 items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 md:hover:bg-emerald-500"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {isLastStep && (
                <span
                  className="flex min-h-11 items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300"
                  title="El guardado se activará al conectar el creador con el catálogo"
                >
                  <Check className="h-4 w-4" />
                  Guardar (próximamente)
                </span>
              )}
            </div>
          </div>
        </section>

        <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Vista previa del personaje">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Vista previa
          </p>
          {preview}
          {dirty && (
            <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
              La vista previa se actualiza al instante con los cambios.
            </p>
          )}
        </aside>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setPreviewOpen(false)}>
          <div
            role="dialog"
            aria-label="Vista previa del personaje"
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-neutral-800 bg-neutral-950 p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Vista previa</p>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 transition active:scale-90"
                aria-label="Cerrar vista previa"
              >
                <EyeOff className="h-5 w-5" />
              </button>
            </div>
            {preview}
          </div>
        </div>
      )}
    </Page>
  );
}
