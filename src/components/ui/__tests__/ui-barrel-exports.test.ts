describe("components/ui barrel exports", () => {
  let uiExports: Record<string, unknown>;

  beforeAll(() => {
    uiExports = require("../index");
  });

  it("exports Accordion components", () => {
    expect(uiExports.Accordion).toBeDefined();
    expect(uiExports.AccordionContent).toBeDefined();
    expect(uiExports.AccordionItem).toBeDefined();
    expect(uiExports.AccordionTrigger).toBeDefined();
  });

  it("exports Alert components", () => {
    expect(uiExports.Alert).toBeDefined();
    expect(uiExports.AlertDescription).toBeDefined();
    expect(uiExports.AlertTitle).toBeDefined();
  });

  it("exports AlertDialog components", () => {
    expect(uiExports.AlertDialog).toBeDefined();
    expect(uiExports.AlertDialogAction).toBeDefined();
    expect(uiExports.AlertDialogCancel).toBeDefined();
    expect(uiExports.AlertDialogContent).toBeDefined();
    expect(uiExports.AlertDialogDescription).toBeDefined();
    expect(uiExports.AlertDialogFooter).toBeDefined();
    expect(uiExports.AlertDialogHeader).toBeDefined();
    expect(uiExports.AlertDialogOverlay).toBeDefined();
    expect(uiExports.AlertDialogPortal).toBeDefined();
    expect(uiExports.AlertDialogRoot).toBeDefined();
    expect(uiExports.AlertDialogTitle).toBeDefined();
    expect(uiExports.AlertDialogTrigger).toBeDefined();
  });

  it("exports Badge and badgeVariants", () => {
    expect(uiExports.Badge).toBeDefined();
    expect(uiExports.badgeVariants).toBeDefined();
  });

  it("exports Button and buttonVariants", () => {
    expect(uiExports.Button).toBeDefined();
    expect(uiExports.buttonVariants).toBeDefined();
  });

  it("exports Calendar components", () => {
    expect(uiExports.Calendar).toBeDefined();
    expect(uiExports.CalendarDayButton).toBeDefined();
  });

  it("exports Card components", () => {
    expect(uiExports.Card).toBeDefined();
    expect(uiExports.CardContent).toBeDefined();
    expect(uiExports.CardDescription).toBeDefined();
    expect(uiExports.CardFooter).toBeDefined();
    expect(uiExports.CardHeader).toBeDefined();
    expect(uiExports.CardTitle).toBeDefined();
  });

  it("exports Checkbox", () => {
    expect(uiExports.Checkbox).toBeDefined();
  });

  it("exports ContextMenu components", () => {
    expect(uiExports.ContextMenu).toBeDefined();
    expect(uiExports.ContextMenuContent).toBeDefined();
    expect(uiExports.ContextMenuItem).toBeDefined();
    expect(uiExports.ContextMenuLabel).toBeDefined();
    expect(uiExports.ContextMenuSeparator).toBeDefined();
    expect(uiExports.ContextMenuTrigger).toBeDefined();
  });

  it("exports CopyButton", () => {
    expect(uiExports.CopyButton).toBeDefined();
  });

  it("exports Dialog components", () => {
    expect(uiExports.Dialog).toBeDefined();
    expect(uiExports.DialogClose).toBeDefined();
    expect(uiExports.DialogContent).toBeDefined();
    expect(uiExports.DialogDescription).toBeDefined();
    expect(uiExports.DialogFooter).toBeDefined();
    expect(uiExports.DialogHeader).toBeDefined();
    expect(uiExports.DialogOverlay).toBeDefined();
    expect(uiExports.DialogPortal).toBeDefined();
    expect(uiExports.DialogRoot).toBeDefined();
    expect(uiExports.DialogTitle).toBeDefined();
    expect(uiExports.DialogTrigger).toBeDefined();
  });

  it("exports Drawer components", () => {
    expect(uiExports.Drawer).toBeDefined();
    expect(uiExports.DrawerClose).toBeDefined();
    expect(uiExports.DrawerContent).toBeDefined();
    expect(uiExports.DrawerDescription).toBeDefined();
    expect(uiExports.DrawerFooter).toBeDefined();
    expect(uiExports.DrawerHeader).toBeDefined();
    expect(uiExports.DrawerMain).toBeDefined();
    expect(uiExports.DrawerOverlay).toBeDefined();
    expect(uiExports.DrawerPortal).toBeDefined();
    expect(uiExports.DrawerTitle).toBeDefined();
    expect(uiExports.DrawerTrigger).toBeDefined();
  });

  it("exports Dropzone components", () => {
    expect(uiExports.Dropzone).toBeDefined();
    expect(uiExports.DropzoneContent).toBeDefined();
    expect(uiExports.DropzoneEmptyState).toBeDefined();
  });

  it("exports ErrorState", () => {
    expect(uiExports.ErrorState).toBeDefined();
  });

  it("exports FilePreview", () => {
    expect(uiExports.FilePreview).toBeDefined();
  });

  it("exports FileTypeIcon and getFileType", () => {
    expect(uiExports.FileTypeIcon).toBeDefined();
    expect(uiExports.getFileType).toBeDefined();
  });

  it("exports FilterButton", () => {
    expect(uiExports.FilterButton).toBeDefined();
  });

  it("exports FilterPopover", () => {
    expect(uiExports.FilterPopover).toBeDefined();
  });

  it("exports Form components", () => {
    expect(uiExports.Form).toBeDefined();
    expect(uiExports.FormControl).toBeDefined();
    expect(uiExports.FormDescription).toBeDefined();
    expect(uiExports.FormField).toBeDefined();
    expect(uiExports.FormItem).toBeDefined();
    expect(uiExports.FormLabel).toBeDefined();
    expect(uiExports.FormMessage).toBeDefined();
    expect(uiExports.useFormField).toBeDefined();
  });

  it("exports Icon and iconVariants", () => {
    expect(uiExports.Icon).toBeDefined();
    expect(uiExports.iconVariants).toBeDefined();
  });

  it("exports IconButton and iconButtonVariants", () => {
    expect(uiExports.IconButton).toBeDefined();
    expect(uiExports.iconButtonVariants).toBeDefined();
  });

  it("exports ImageGallery", () => {
    expect(uiExports.ImageGallery).toBeDefined();
  });

  it("exports ImagePreview", () => {
    expect(uiExports.ImagePreview).toBeDefined();
  });

  it("exports Input", () => {
    expect(uiExports.Input).toBeDefined();
  });

  it("exports InputTag", () => {
    expect(uiExports.InputTag).toBeDefined();
  });

  it("exports Label", () => {
    expect(uiExports.Label).toBeDefined();
  });

  it("exports LoadingOverlay", () => {
    expect(uiExports.LoadingOverlay).toBeDefined();
  });

  it("exports Map components", () => {
    expect(uiExports.Map).toBeDefined();
    expect(uiExports.MapClusterLayer).toBeDefined();
    expect(uiExports.MapControls).toBeDefined();
    expect(uiExports.MapMarker).toBeDefined();
    expect(uiExports.MapPopup).toBeDefined();
    expect(uiExports.MapRoute).toBeDefined();
    expect(uiExports.MarkerContent).toBeDefined();
    expect(uiExports.MarkerLabel).toBeDefined();
    expect(uiExports.MarkerPopup).toBeDefined();
    expect(uiExports.MarkerTooltip).toBeDefined();
    expect(uiExports.PulsingMarker).toBeDefined();
    expect(uiExports.useMap).toBeDefined();
    expect(uiExports.useMarkerContext).toBeDefined();
  });

  it("exports Pagination components", () => {
    expect(uiExports.DynamicPagination).toBeDefined();
    expect(uiExports.generatePaginationRange).toBeDefined();
  });

  it("exports Popover components", () => {
    expect(uiExports.Popover).toBeDefined();
    expect(uiExports.PopoverAnchor).toBeDefined();
    expect(uiExports.PopoverContent).toBeDefined();
    expect(uiExports.PopoverTrigger).toBeDefined();
  });

  it("exports RadioGroup components", () => {
    expect(uiExports.RadioGroup).toBeDefined();
    expect(uiExports.RadioGroupItem).toBeDefined();
  });

  it("exports ScrollArea components", () => {
    expect(uiExports.ScrollArea).toBeDefined();
    expect(uiExports.ScrollBar).toBeDefined();
  });

  it("exports Select components", () => {
    expect(uiExports.Select).toBeDefined();
    expect(uiExports.SelectContent).toBeDefined();
    expect(uiExports.SelectGroup).toBeDefined();
    expect(uiExports.SelectItem).toBeDefined();
    expect(uiExports.SelectLabel).toBeDefined();
    expect(uiExports.SelectSeparator).toBeDefined();
    expect(uiExports.SelectTrigger).toBeDefined();
    expect(uiExports.SelectValue).toBeDefined();
  });

  it("exports Skeleton", () => {
    expect(uiExports.Skeleton).toBeDefined();
  });

  it("exports Spinner", () => {
    expect(uiExports.Spinner).toBeDefined();
  });

  it("exports Stepper", () => {
    expect(uiExports.Stepper).toBeDefined();
  });

  it("exports Switch and switchVariants", () => {
    expect(uiExports.Switch).toBeDefined();
    expect(uiExports.switchVariants).toBeDefined();
  });

  it("exports Textarea", () => {
    expect(uiExports.Textarea).toBeDefined();
  });

  it("exports Toaster", () => {
    expect(uiExports.Toaster).toBeDefined();
  });

  it("exports ToggleButtonGroup", () => {
    expect(uiExports.ToggleButtonGroup).toBeDefined();
  });

  it("exports Tooltip components", () => {
    expect(uiExports.Tooltip).toBeDefined();
    expect(uiExports.TooltipContent).toBeDefined();
    expect(uiExports.TooltipProvider).toBeDefined();
    expect(uiExports.TooltipTrigger).toBeDefined();
  });

  it("exports Waveform components", () => {
    expect(uiExports.DEFAULT_PLAYER_CONFIG).toBeDefined();
    expect(uiExports.DEFAULT_WAVEFORM_CONFIG).toBeDefined();
    expect(uiExports.useWaveform).toBeDefined();
    expect(uiExports.useWaveformPlayer).toBeDefined();
    expect(uiExports.useWaveformRecorder).toBeDefined();
    expect(uiExports.WaveformPlayer).toBeDefined();
    expect(uiExports.WaveformRecorder).toBeDefined();
  });
});
