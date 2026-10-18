export const additionalFoundations = [
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    description: "Confirm an action in context.",
    rule: "Radix focus trap, cancellation and focus return.",
    usage:
      "<AlertDialog><AlertDialogTrigger asChild><Button>Archive</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogTitle>Archive collection?</AlertDialogTitle><AlertDialogDescription>You can restore it later.</AlertDialogDescription><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Archive</AlertDialogAction></AlertDialogContent></AlertDialog>",
    actions: ["Expand"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "26",
    source: "upstream/shadcn/alert-dialog.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "aspect-ratio",
    name: "Aspect Ratio",
    description: "Reserve the composition before it loads.",
    rule: "A fixed ratio reserves media geometry across widths.",
    usage:
      '<AspectRatio ratio={16 / 9}><img src="/landscape.jpg" alt="Mountain landscape" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AspectRatio>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "27",
    source: "upstream/shadcn/aspect-ratio.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "attachment",
    name: "Attachment",
    description: "The file keeps its place.",
    rule: "File state changes inside the same reserved attachment surface.",
    usage:
      '<Attachment state="done"><AttachmentMedia><FileText /></AttachmentMedia><AttachmentContent><AttachmentTitle>Notes.pdf</AttachmentTitle><AttachmentDescription>2.4 MB</AttachmentDescription></AttachmentContent></Attachment>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "28",
    source: "upstream/shadcn/attachment.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "bubble",
    name: "Bubble",
    description: "Give each thought its own space.",
    rule: "Content wraps inside a retained message surface.",
    usage:
      '<Bubble variant="secondary"><BubbleContent>A thought worth keeping.</BubbleContent></Bubble>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "29",
    source: "upstream/shadcn/bubble.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "button-group",
    name: "Button Group",
    description: "Related actions, one footprint.",
    rule: "Group semantics and orientation preserve individual native controls.",
    usage:
      '<ButtonGroup aria-label="Quantity"><Button onClick={decrease}>−</Button><Button>{count}</Button><Button onClick={increase}>+</Button></ButtonGroup>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "30",
    source: "upstream/shadcn/button-group.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Choose a day, keep the context.",
    rule: "React DayPicker owns date and keyboard semantics; the selected date belongs to the caller.",
    usage: '<Calendar mode="single" selected={date} onSelect={setDate} />',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "31",
    source: "upstream/shadcn/calendar.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "carousel",
    name: "Carousel",
    description: "Move through the same cards.",
    rule: "Embla keeps slides mounted through drag, keyboard and button navigation.",
    usage:
      "<Carousel><CarouselContent>{items.map(item => <CarouselItem key={item.id}>{item.content}</CarouselItem>)}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "32",
    source: "upstream/shadcn/carousel.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "chart",
    name: "Chart",
    description: "Data stays legible as space changes.",
    rule: "A bounded Recharts container preserves chart identity during measurement. Supply an accessible data representation when needed.",
    usage:
      '<ChartContainer config={{ visits: { label: "Visits", color: "#737373" } }} style={{ height: 220 }}><BarChart accessibilityLayer data={data}><XAxis dataKey="day" /><Bar dataKey="visits" fill="var(--color-visits)" isAnimationActive={false} /></BarChart></ChartContainer>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "33",
    source: "upstream/shadcn/chart.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "code-block",
    name: "Code Block",
    description: "Read, select, and copy the original.",
    rule: "Native code selection and overflow; copy feedback does not replace the code node.",
    usage:
      "<CodeBlock><CodeBlockHeader><CodeBlockTitle>example.tsx</CodeBlockTitle><CodeBlockActions><CodeBlockCopyButton value={code} /></CodeBlockActions></CodeBlockHeader><CodeBlockContent lineNumbers>{code}</CodeBlockContent></CodeBlock>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "34",
    source: "upstream/shadcn/code-block.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "collapsible",
    name: "Collapsible",
    description: "Fold away without losing a draft.",
    rule: "ROC retains content, makes the closed region inert, and reverses its grid-track transition in place.",
    usage:
      '<Collapsible defaultOpen><CollapsibleTrigger asChild><Button>Details</Button></CollapsibleTrigger><CollapsibleContent><Textarea defaultValue="Keep this draft" /></CollapsibleContent></Collapsible>',
    actions: ["Expand"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "35",
    source: "upstream/shadcn/collapsible.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "combobox",
    name: "Combobox",
    description: "Search and choose in one place.",
    rule: "Base UI owns filtering, active descendants, selection and collision handling.",
    usage:
      '<Combobox items={options}><ComboboxInput aria-label="Framework" /><ComboboxContent><ComboboxEmpty>No results.</ComboboxEmpty><ComboboxList>{item => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList></ComboboxContent></Combobox>',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "36",
    source: "upstream/shadcn/combobox.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "command",
    name: "Command",
    description: "Find an action without leaving.",
    rule: "cmdk provides search, keyboard navigation and empty states.",
    usage:
      '<Command><CommandInput placeholder="Search actions…" /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandItem onSelect={createNote}>New note</CommandItem></CommandList></Command>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "37",
    source: "upstream/shadcn/command.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "context-menu",
    name: "Context Menu",
    description: "Actions stay with their object.",
    rule: "Radix supports context-menu gestures, keyboard selection and focus return.",
    usage:
      "<ContextMenu><ContextMenuTrigger>Collection</ContextMenuTrigger><ContextMenuContent><ContextMenuItem onSelect={rename}>Rename</ContextMenuItem></ContextMenuContent></ContextMenu>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "38",
    source: "upstream/shadcn/context-menu.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "data-table",
    name: "Data Table",
    description: "Filter and sort stable records.",
    rule: "TanStack Table v8 powers sorting, filtering and pagination. getRowId is required so visible records keep domain identity.",
    usage:
      '<DataTable data={records} columns={columns} getRowId={row => row.id} pageSize={5} label="Collections" />',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "39",
    source: "upstream/shadcn/data-table.mdx",
    props:
      "data · columns · getRowId (required) · pageSize? · searchable? · label?",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "date-picker",
    name: "Date Picker",
    description: "A date belongs to its field.",
    rule: "Composes Calendar, Popover and Button; selection closes the popup and returns focus.",
    usage:
      '<DatePicker value={date} onValueChange={setDate} label="Publication date" />',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "40",
    source: "upstream/shadcn/date-picker.mdx",
    props: "value? · defaultValue? · onValueChange? · label? · disabled?",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "direction",
    name: "Direction",
    description: "Rearrange reading, retain the field.",
    rule: "Radix direction context changes logical navigation. Set dir on the same DOM container for text and layout.",
    usage:
      '<DirectionProvider dir={direction}><div dir={direction}><Input aria-label="Title" /></div></DirectionProvider>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "41",
    source: "upstream/shadcn/direction.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "edge-panel",
    name: "Edge Panel",
    description: "Settings that wait at the edge of the window.",
    rule: "Move the pointer to the edge and the panel slides in; leave and it slides away, unless pinned. Hiding inerts it and never remounts what sits behind it.",
    usage:
      '<EdgePanel><EdgePanelTrigger asChild><Button variant="ghost">Style</Button></EdgePanelTrigger><EdgePanelContent title="Appearance">…controls…</EdgePanelContent></EdgePanel>',
    actions: ["Hover", "Expand"],
    category: "shadcn foundations",
    tag: "ROC",
    number: "67",
    source: "registry/roc/edge-panel.tsx",
    props:
      "EdgePanel: open? · defaultOpen? · pinned? · side? ('left' | 'right') · contained? · hideDelay? — EdgePanelTrigger · EdgePanelContent (title?) · useEdgePanel()",
    limit:
      "Pointer reveal is mouse-only; touch and keyboard use the trigger. Menus opened from inside the panel keep it open. Add a window-level pointer listener of your own if an iframe sits behind it.",
  },
  {
    id: "drawer",
    name: "Drawer",
    description: "A surface you can put away.",
    rule: "Vaul coordinates drag, focus and dismissal. Keep persistent form state above the transient drawer.",
    usage:
      "<Drawer><DrawerTrigger asChild><Button>Edit</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Edit note</DrawerTitle><DrawerDescription>Keep your thought.</DrawerDescription></DrawerHeader><Textarea value={draft} onChange={e => setDraft(e.target.value)} /></DrawerContent></Drawer>",
    actions: ["Expand"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "42",
    source: "upstream/shadcn/drawer.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "empty",
    name: "Empty",
    description: "A quiet place to begin.",
    rule: "Compose an explicit empty state and a caller-owned action.",
    usage:
      "<Empty><EmptyHeader><EmptyTitle>No collections</EmptyTitle><EmptyDescription>Create your first collection.</EmptyDescription></EmptyHeader><EmptyContent><Button onClick={create}>Create</Button></EmptyContent></Empty>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "43",
    source: "upstream/shadcn/empty.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "field",
    name: "Field",
    description: "Keep help beside its input.",
    rule: "Semantic field grouping, labels, descriptions and errors; caller owns validation.",
    usage:
      '<Field><FieldLabel htmlFor="name">Name</FieldLabel><Input id="name" aria-describedby="name-hint" /><FieldDescription id="name-hint">A memorable name.</FieldDescription></Field>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "44",
    source: "upstream/shadcn/field.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "hover-card",
    name: "Hover Card",
    description: "Context stays beside the reference.",
    rule: "A supplementary Radix hover/focus preview; keep essential information reachable without hover.",
    usage:
      '<HoverCard><HoverCardTrigger asChild><a href="/profile">Alex</a></HoverCardTrigger><HoverCardContent>Designer and observer.</HoverCardContent></HoverCard>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "45",
    source: "upstream/shadcn/hover-card.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "input-group",
    name: "Input Group",
    description: "Keep actions attached to the field.",
    rule: "Addons share one border while native input state stays in the same element.",
    usage:
      '<InputGroup><InputGroupAddon><Search /></InputGroupAddon><InputGroupInput aria-label="Search" placeholder="Search…" /></InputGroup>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "46",
    source: "upstream/shadcn/input-group.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "input-otp",
    name: "Input OTP",
    description: "One input, clear character slots.",
    rule: "input-otp keeps one accessible input for typing, selection, paste and autocomplete.",
    usage:
      '<InputOTP maxLength={6} aria-label="Verification code"><InputOTPGroup>{[0,1,2,3,4,5].map(index => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup></InputOTP>',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "47",
    source: "upstream/shadcn/input-otp.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "item",
    name: "Item",
    description: "An object and its contextual action.",
    rule: "A composable row wraps without moving ownership into the gallery.",
    usage:
      '<Item variant="outline"><ItemContent><ItemTitle>Field notes</ItemTitle><ItemDescription>Updated today</ItemDescription></ItemContent><ItemActions><Button onClick={open}>Open</Button></ItemActions></Item>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "48",
    source: "upstream/shadcn/item.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "kbd",
    name: "Kbd",
    description: "Make shortcuts easy to read.",
    rule: "Semantic keyboard notation; this component does not register global shortcuts.",
    usage: "<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "49",
    source: "upstream/shadcn/kbd.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "label",
    name: "Label",
    description: "A name that focuses its control.",
    rule: "Radix label preserves native associations and text-selection behavior.",
    usage: '<><Label htmlFor="title">Title</Label><Input id="title" /></>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "50",
    source: "upstream/shadcn/label.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "marker",
    name: "Marker",
    description: "Keep a change of context visible.",
    rule: "An inline separator marks a point in a conversation without replacing messages.",
    usage:
      '<Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "51",
    source: "upstream/shadcn/marker.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "menubar",
    name: "Menubar",
    description: "A stable home for commands.",
    rule: "Radix provides roving focus, arrow navigation and nested-menu semantics.",
    usage:
      "<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem onSelect={create}>New note</MenubarItem></MenubarContent></MenubarMenu></Menubar>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "52",
    source: "upstream/shadcn/menubar.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "message",
    name: "Message",
    description: "Keep author, content, and context together.",
    rule: "One message tree carries its alignment, author and metadata.",
    usage:
      "<Message><MessageContent><MessageHeader>Alex</MessageHeader><Bubble><BubbleContent>Hello.</BubbleContent></Bubble><MessageFooter>10:24</MessageFooter></MessageContent></Message>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "53",
    source: "upstream/shadcn/message.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "message-scroller",
    name: "Message Scroller",
    description: "Follow new messages without losing your place.",
    rule: "The shadcn scroller preserves anchors and exposes an explicit return-to-end control. Use durable messageId values.",
    usage:
      "<MessageScrollerProvider><MessageScroller style={{height:320}}><MessageScrollerViewport><MessageScrollerContent>{messages.map(message => <MessageScrollerItem key={message.id} messageId={message.id}>{message.content}</MessageScrollerItem>)}</MessageScrollerContent></MessageScrollerViewport><MessageScrollerButton /></MessageScroller></MessageScrollerProvider>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "54",
    source: "upstream/shadcn/message-scroller.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "native-select",
    name: "Native Select",
    description: "A familiar choice on every device.",
    rule: "Native select behavior retains platform keyboard and mobile picker semantics.",
    usage:
      '<NativeSelect aria-label="Visibility"><NativeSelectOption value="private">Only me</NativeSelectOption><NativeSelectOption value="team">Workspace</NativeSelectOption></NativeSelect>',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "55",
    source: "upstream/shadcn/native-select.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "navigation-menu",
    name: "Navigation Menu",
    description: "Keep destinations in reach.",
    rule: "Radix navigation primitives preserve keyboard access and contextual disclosure.",
    usage:
      '<NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuLink href="/guide">Guide</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "56",
    source: "upstream/shadcn/navigation-menu.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "questionnaire",
    name: "Questionnaire",
    description: "Move between questions with answers intact.",
    rule: "The shadcn questionnaire primitive owns named fields, progress, required validation and previous/next navigation.",
    usage:
      '<Questionnaire onSubmit={submit}><QuestionnaireItem name="title" required><QuestionnaireTitle>Collection name</QuestionnaireTitle><QuestionnaireInput aria-label="Collection name" /></QuestionnaireItem><QuestionnaireActions><QuestionnairePrevious /><QuestionnaireNext /><QuestionnaireSubmit /></QuestionnaireActions></Questionnaire>',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "57",
    source: "upstream/shadcn/questionnaire.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "resizable",
    name: "Resizable",
    description: "Make room around the same editor.",
    rule: "react-resizable-panels v4 preserves child nodes through pointer and keyboard resizing.",
    usage:
      '<ResizablePanelGroup orientation="horizontal"><ResizablePanel defaultSize="40%">Sources</ResizablePanel><ResizableHandle withHandle /><ResizablePanel><Textarea /></ResizablePanel></ResizablePanelGroup>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "58",
    source: "upstream/shadcn/resizable.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "select",
    name: "Select",
    description: "A choice anchored to its trigger.",
    rule: "Radix selection, typeahead and keyboard semantics with scoped ROC styling.",
    usage:
      '<Select defaultValue="private"><SelectTrigger aria-label="Sharing"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="private">Only me</SelectItem><SelectItem value="team">Workspace</SelectItem></SelectContent></Select>',
    actions: ["Select"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "59",
    source: "upstream/shadcn/select.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "sheet",
    name: "Sheet",
    description: "Inspect without leaving the object.",
    rule: "A Radix dialog surface positioned at an edge. Persistent form values belong above the transient overlay.",
    usage:
      "<Sheet><SheetTrigger asChild><Button>Inspect</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Settings</SheetTitle><SheetDescription>Edit this collection.</SheetDescription></SheetHeader><Input value={title} onChange={e => setTitle(e.target.value)} /></SheetContent></Sheet>",
    actions: ["Expand"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "60",
    source: "upstream/shadcn/sheet.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Transient popup content unmounts after dismissal. Keep persistent values above it; changing viewport width preserves an open content tree.",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "One navigation tree at every width.",
    rule: "ROC uses a retained inline aside with container-based sizing. Collapsing hides and inerts it; no mobile remount, cookies or global shortcuts.",
    usage:
      "<SidebarProvider><Sidebar><SidebarHeader>Workspace</SidebarHeader><SidebarContent><SidebarMenu><SidebarMenuItem><SidebarMenuButton isActive>Home</SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarContent></Sidebar><SidebarInset><SidebarTrigger /><Textarea /></SidebarInset></SidebarProvider>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "61",
    source: "upstream/shadcn/sidebar.tsx",
    props:
      "SidebarProvider open? · defaultOpen? · onOpenChange? · Sidebar · SidebarInset · SidebarTrigger",
    limit:
      "An inline, retained navigation variant. It does not implement the upstream off-canvas mobile Sheet or cookie persistence.",
  },
  {
    id: "spinner",
    name: "Spinner",
    description: "A bounded sign of ongoing work.",
    rule: "Explicit loading status; reduced motion retains the indicator without continuous rotation.",
    usage: '<Spinner aria-label="Saving collection" />',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "62",
    source: "upstream/shadcn/spinner.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "table",
    name: "Table",
    description: "Keep columns readable in limited space.",
    rule: "Semantic table elements live in a horizontal overflow region.",
    usage:
      "<Table><TableCaption>Collections</TableCaption><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Field notes</TableCell></TableRow></TableBody></Table>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "63",
    source: "upstream/shadcn/table.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "toast",
    name: "Toast",
    description: "Feedback leaves the work in place.",
    rule: "Base UI manages announcements, dismissal and stacked notifications. Use a provider scoped to your application.",
    usage:
      '<><Toaster /><Button onClick={() => toast.add({title:"Saved",type:"success"})}>Save</Button></>',
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "64",
    source: "upstream/shadcn/toast.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "trace",
    name: "Trace",
    description: "Keep the steps behind a result.",
    rule: "A compact trace composes retained collapsibles; disclosure preserves its evidence nodes.",
    usage:
      "<Trace><TraceCollapsible><TraceCollapsibleTrigger><TraceLine><TraceTitle>Read sources</TraceTitle></TraceLine></TraceCollapsibleTrigger><TraceCollapsibleContent>Source details.</TraceCollapsibleContent></TraceCollapsible></Trace>",
    actions: ["Expand"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "65",
    source: "upstream/shadcn/trace.tsx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
  {
    id: "typography",
    name: "Typography",
    description: "Hierarchy with room to read.",
    rule: "Semantic text styles are scoped to Typography; the host page is not reset.",
    usage:
      "<Typography><TypographyH2>Field notes</TypographyH2><TypographyP>A thought worth keeping.</TypographyP><TypographyBlockquote>Keep the context.</TypographyBlockquote></Typography>",
    actions: ["Interact"],
    category: "shadcn foundations",
    tag: "shadcn → ROC",
    number: "66",
    source: "upstream/shadcn/typography.mdx",
    props:
      "Composable React props; see the source for typed options, controlled state and refs.",
    limit:
      "Independent React source and namespaced CSS. Host applications own business data, network requests and persistence.",
  },
];
