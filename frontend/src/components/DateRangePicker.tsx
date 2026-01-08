import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  onRegionChange?: (region: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  initialRegion?: string;
}

const REGIOES = [
  { value: "", label: "Todas as Regiões" },
  { value: "Sul", label: "Sul" },
  { value: "Centro-Oeste", label: "Centro-Oeste" },
  { value: "Nordeste", label: "Nordeste" },
  { value: "Norte", label: "Norte" },
  { value: "Sudeste", label: "Sudeste" },
];

export const DateRangePicker = ({ onDateChange, onRegionChange, initialStartDate, initialEndDate, initialRegion }: DateRangePickerProps) => {
  // Converter strings de data YYYY-MM-DD para Date
  const parseDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    } catch (e) {
      console.error('Erro ao fazer parse da data:', dateStr);
    }
    return new Date();
  };

  const today = new Date();
  const defaultStart = initialStartDate ? parseDate(initialStartDate) : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const defaultEnd = initialEndDate ? parseDate(initialEndDate) : today;
  
  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion || "");

  // Presets de datas
  const presets = [
    {
      label: 'Últimos 7 dias',
      getValue: () => {
        const end = new Date();
        const start = subDays(end, 7);
        return { start, end };
      }
    },
    {
      label: 'Últimos 30 dias',
      getValue: () => {
        const end = new Date();
        const start = subDays(end, 30);
        return { start, end };
      }
    },
    {
      label: 'Últimos 90 dias',
      getValue: () => {
        const end = new Date();
        const start = subDays(end, 90);
        return { start, end };
      }
    },
    {
      label: 'Este mês',
      getValue: () => {
        const end = new Date();
        const start = startOfMonth(end);
        return { start, end };
      }
    },
    {
      label: 'Este ano',
      getValue: () => {
        const end = new Date();
        const start = startOfYear(end);
        return { start, end };
      }
    },
  ];

  const applyPreset = (getValue: () => { start: Date; end: Date }) => {
    const { start, end } = getValue();
    setStartDate(start);
    setEndDate(end);
  };

  const handleApply = () => {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    console.log('✅ FILTRO APLICADO:', { 
      dataInicio: start, 
      dataFim: end, 
      regiao: selectedRegion || 'Todas as Regiões',
      diasSelecionados: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    });
    onDateChange(start, end);
    if (onRegionChange) {
      onRegionChange(selectedRegion);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    const newToday = new Date();
    const newThirtyDaysAgo = new Date(newToday.getTime() - 30 * 24 * 60 * 60 * 1000);
    setStartDate(newThirtyDaysAgo);
    setEndDate(newToday);
    setSelectedRegion("");
    const start = format(newThirtyDaysAgo, 'yyyy-MM-dd');
    const end = format(newToday, 'yyyy-MM-dd');
    console.log('🔄 FILTRO RESETADO para últimos 30 dias - Todas as Regiões:', { start, end });
    onDateChange(start, end);
    if (onRegionChange) {
      onRegionChange("");
    }
  };

  const formatDisplay = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full bg-white rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 shadow-sm dark:bg-[rgb(25,28,37)]">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-[rgb(45,58,75)]">
            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white">Filtrar por Período e Região</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {daysDiff} dias selecionados
            </p>
          </div>
        </div>

        {/* Main Date Range Display */}
        <div className="flex gap-3">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button className="flex-1 h-auto py-3 px-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 dark:border-blue-700 text-gray-900 dark:text-white font-semibold justify-between dark:bg-[rgb(45,58,75)] dark:hover:bg-[rgb(55,68,85)]">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">Período e Região</span>
                  <span className="text-lg">{formatDisplay(startDate)} → {formatDisplay(endDate)}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[95vw] sm:w-auto p-3 sm:p-4 max-h-[90vh] overflow-y-auto" align="start">
              <div className="space-y-3 min-w-max">
                {/* Region Filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-900 dark:text-white mb-1 block">Região:</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-gray-900 dark:text-white dark:border-gray-600 dark:bg-[rgb(45,58,75)] text-xs font-medium"
                  >
                    {REGIOES.map((regiao) => (
                      <option key={regiao.value} value={regiao.value}>
                        {regiao.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Presets */}
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Atalhos:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset.getValue)}
                        className="text-xs h-7 hover:bg-blue-50 hover:border-blue-300 dark:hover:border-blue-700 dark:hover:bg-[rgb(45,58,75)]"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-3">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Selecione manualmente:</p>
                  
                  {/* Dois Blocos: Data Inicial e Data Final - lado a lado em desktop, empilhados em mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Data Inicial */}
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Data Inicial</label>
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-0.5">Mês</label>
                          <select
                            value={startDate.getMonth()}
                            onChange={(e) => {
                              const newDate = setMonth(startDate, parseInt(e.target.value));
                              if (newDate <= endDate) setStartDate(newDate);
                            }}
                            className="w-full px-1.5 py-1 border border-gray-300 rounded text-gray-900 dark:text-white dark:border-gray-600 dark:bg-[rgb(45,58,75)] text-xs font-medium"
                          >
                            {Array.from({ length: 12 }).map((_, i) => {
                              const date = new Date(2024, i, 1);
                              return (
                                <option key={i} value={i}>
                                  {format(date, 'MMM', { locale: ptBR })}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-0.5">Ano</label>
                          <select
                            value={startDate.getFullYear()}
                            onChange={(e) => {
                              const newDate = setYear(startDate, parseInt(e.target.value));
                              if (newDate <= endDate) setStartDate(newDate);
                            }}
                            className="w-full px-1.5 py-1 border border-gray-300 rounded text-gray-900 dark:text-white dark:border-gray-600 dark:bg-[rgb(45,58,75)] text-xs font-medium"
                          >
                            {Array.from({ length: 10 }).map((_, i) => {
                              const year = new Date().getFullYear() - 5 + i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 text-center font-medium">
                        {format(startDate, 'dd/MM', { locale: ptBR })}
                      </p>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date && date <= endDate) {
                            setStartDate(date);
                          }
                        }}
                        month={startDate}
                        onMonthChange={setStartDate}
                        disabled={(date) => date > endDate || date > new Date()}
                        locale={ptBR}
                        className="rounded border-gray-200 dark:border-gray-700 w-full text-[10px] sm:text-xs scale-90 sm:scale-100 origin-top"
                      />
                    </div>

                    {/* Data Final */}
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Data Final</label>
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-0.5">Mês</label>
                          <select
                            value={endDate.getMonth()}
                            onChange={(e) => {
                              const newDate = setMonth(endDate, parseInt(e.target.value));
                              if (newDate >= startDate && newDate <= new Date()) setEndDate(newDate);
                            }}
                            className="w-full px-1.5 py-1 border border-gray-300 rounded text-gray-900 dark:text-white dark:border-gray-600 dark:bg-[rgb(45,58,75)] text-xs font-medium"
                          >
                            {Array.from({ length: 12 }).map((_, i) => {
                              const date = new Date(2024, i, 1);
                              return (
                                <option key={i} value={i}>
                                  {format(date, 'MMM', { locale: ptBR })}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-0.5">Ano</label>
                          <select
                            value={endDate.getFullYear()}
                            onChange={(e) => {
                              const newDate = setYear(endDate, parseInt(e.target.value));
                              if (newDate >= startDate && newDate <= new Date()) setEndDate(newDate);
                            }}
                            className="w-full px-1.5 py-1 border border-gray-300 rounded text-gray-900 dark:text-white dark:border-gray-600 dark:bg-[rgb(45,58,75)] text-xs font-medium"
                          >
                            {Array.from({ length: 10 }).map((_, i) => {
                              const year = new Date().getFullYear() - 5 + i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 text-center font-medium">
                        {format(endDate, 'dd/MM', { locale: ptBR })}
                      </p>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date && date >= startDate && date <= new Date()) {
                            setEndDate(date);
                          }
                        }}
                        month={endDate}
                        onMonthChange={setEndDate}
                        disabled={(date) => date < startDate || date > new Date()}
                        locale={ptBR}
                        className="rounded border-gray-200 dark:border-gray-700 w-full text-[10px] sm:text-xs scale-90 sm:scale-100 origin-top"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions - Sticky */}
                <div className="border-t dark:border-gray-700 pt-3 mt-3 flex gap-2 justify-end sticky bottom-0 bg-white dark:bg-[rgb(25,28,37)] pb-2">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                  >
                    <X className="w-3 h-3" />
                    Resetar
                  </Button>
                  <Button
                    onClick={handleApply}
                    size="sm"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <CalendarIcon className="w-3 h-3" />
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 dark:border-blue-800 dark:bg-[rgb(45,58,75)]">
          <span className="font-semibold text-gray-900 dark:text-white">{daysDiff} dias</span> de análise selecionados ({formatDisplay(startDate)} até {formatDisplay(endDate)}) 
          {selectedRegion && <span> • Região: <span className="font-semibold text-gray-900 dark:text-white">{REGIOES.find(r => r.value === selectedRegion)?.label}</span></span>}
        </div>
      </div>
    </div>
  );
};
