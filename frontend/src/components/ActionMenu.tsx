import { useState } from "react";
import { Menu, X, FileText, FileSpreadsheet, Printer, Upload, Moon, Sun, Download, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleAction = (action: () => void, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isExporting}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium text-white w-full justify-between"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  {isExporting ? "Exportando..." : "Exportar"}
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[252px]">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  if (!isExporting) {
                    onExportCSV();
                    setIsOpen(false);
                  }
                }}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  if (!isExporting) {
                    onExportExcel();
                    setIsOpen(false);
                  }
                }}
                disabled={isExporting}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button
            onClick={(e) => handleAction(onPrint, e)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium text-accent-foreground w-full justify-start"
            type="button"
          >
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTheme(theme === "dark" ? "light" : "dark");
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium w-full justify-start"
            type="button"
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
            onClick={(e) => handleAction(onNewUpload, e)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium w-full justify-start"
            type="button"
          >
            <Upload className="w-5 h-5" />
            Novo Upload
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
