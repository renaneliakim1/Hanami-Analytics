import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const DateRangePicker = ({ onDateChange, initialStartDate, initialEndDate }: DateRangePickerProps) => {
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
    console.log('📅 Aplicando filtro de datas:', { start, end });
    onDateChange(start, end);
    setIsOpen(false);
  };

  const handleReset = () => {
    const newToday = new Date();
    const newThirtyDaysAgo = new Date(newToday.getTime() - 30 * 24 * 60 * 60 * 1000);
    setStartDate(newThirtyDaysAgo);
    setEndDate(newToday);
    const start = format(newThirtyDaysAgo, 'yyyy-MM-dd');
    const end = format(newToday, 'yyyy-MM-dd');
    console.log('🔄 Resetando filtro para últimos 30 dias:', { start, end });
    onDateChange(start, end);
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
            <h3 className="font-bold text-gray-900 dark:text-white">Filtrar por Período</h3>
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
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">Período</span>
                  <span className="text-lg">{formatDisplay(startDate)} → {formatDisplay(endDate)}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-6" align="start">
              <div className="space-y-4">
                {/* Presets */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Atalhos rápidos:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset.getValue)}
                        className="text-xs justify-center hover:bg-blue-50 hover:border-blue-300 dark:hover:border-blue-700 dark:hover:bg-[rgb(45,58,75)]"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ou selecione manualmente:</p>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date Calendar */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Data Inicial</p>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date && date <= endDate) {
                            setStartDate(date);
                          }
                        }}
                        disabled={(date) => date > endDate || date > new Date()}
                        locale={ptBR}
                        className="rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                    </div>

                    {/* End Date Calendar */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Data Final</p>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date && date >= startDate) {
                            setEndDate(date);
                          }
                        }}
                        disabled={(date) => date < startDate || date > new Date()}
                        locale={ptBR}
                        className="rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t dark:border-gray-700 pt-4 flex gap-2 justify-end">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Resetar
                  </Button>
                  <Button
                    onClick={handleApply}
                    size="sm"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CalendarIcon className="w-4 h-4" />
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
        </div>
      </div>
    </div>
  );
};
