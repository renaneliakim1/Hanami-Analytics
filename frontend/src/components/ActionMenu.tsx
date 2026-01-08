import { useState } from "react";
import { Menu, X, FileText, FileSpreadsheet, Printer, Upload, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ActionMenuProps {
  onExportCSV: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  onNewUpload: () => void;
  isExporting: boolean;
}

export function ActionMenu({
  onExportCSV,
  onExportExcel,
  onPrint,
  onNewUpload,
  isExporting,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          title="Menu de ações"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Ações</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => handleAction(onExportCSV)}
            disabled={isExporting}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm font-medium text-white w-full justify-start"
          >
            <FileText className="w-5 h-5" />
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </button>
          
          <button
            onClick={() => handleAction(onExportExcel)}
            disabled={isExporting}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium text-white w-full justify-start"
          >
            <FileSpreadsheet className="w-5 h-5" />
            {isExporting ? "Exportando..." : "Exportar Excel"}
          </button>
          
          <button
            onClick={() => handleAction(onPrint)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium text-accent-foreground w-full justify-start"
          >
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
          
          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium w-full justify-start"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                Tema Claro
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                Tema Escuro
              </>
            )}
          </button>
          
          <button
            onClick={() => handleAction(onNewUpload)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium w-full justify-start"
          >
            <Upload className="w-5 h-5" />
            Novo Upload
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
