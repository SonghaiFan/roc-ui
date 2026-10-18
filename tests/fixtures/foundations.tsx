import { useState } from "react";
import { Button, buttonVariants } from "./components/roc/button";
import { Badge } from "./components/roc/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/roc/card";
import { Input } from "./components/roc/input";
import { Textarea } from "./components/roc/textarea";
import { Checkbox } from "./components/roc/checkbox";
import { Switch } from "./components/roc/switch";
import { Slider } from "./components/roc/slider";
import { Separator } from "./components/roc/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/roc/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/roc/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./components/roc/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./components/roc/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./components/roc/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./components/roc/tooltip";
export function FoundationConsumer() {
  const [value, setValue] = useState("a"),
    [open, setOpen] = useState("note"),
    [enabled, setEnabled] = useState(false);
  return (
    <>
      <section>
        <Button onClick={() => setEnabled((v) => !v)} pendingLabel="Saving">
          Consumer button
        </Button>
        <a href="#consumer" className={buttonVariants({ variant: "outline" })}>
          Variant classes
        </a>
      </section>
      <section>
        <Badge>Consumer badge</Badge>
      </section>
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Consumer surface</CardTitle>
          </CardHeader>
          <CardContent>Own content</CardContent>
        </Card>
      </section>
      <section>
        <Input aria-label="Independent input" defaultValue="A native field" />
      </section>
      <section>
        <Textarea
          aria-label="Independent textarea"
          defaultValue="A native draft"
        />
      </section>
      <section>
        <Checkbox
          aria-label="Independent checkbox"
          checked={enabled}
          onCheckedChange={(v) => setEnabled(v === true)}
        />
      </section>
      <section>
        <Switch
          aria-label="Independent switch"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </section>
      <section>
        <Slider aria-label="Independent slider" defaultValue={[30]} />
      </section>
      <section>
        <Separator decorative={false} />
      </section>
      <section>
        <Tabs value={value} onValueChange={setValue}>
          <TabsList aria-label="Independent views">
            <TabsTrigger value="a">Edit independent</TabsTrigger>
            <TabsTrigger value="b">Read independent</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <Input
              aria-label="Independent tab draft"
              defaultValue="Retain me"
            />
          </TabsContent>
          <TabsContent value="b">A different view</TabsContent>
        </Tabs>
      </section>
      <section>
        <Accordion
          type="single"
          value={open}
          onValueChange={setOpen}
          collapsible
        >
          <AccordionItem value="note">
            <AccordionTrigger>Independent fold</AccordionTrigger>
            <AccordionContent>
              <Input
                aria-label="Independent fold draft"
                defaultValue="Fold me"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <section>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Independent dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Independent form</DialogTitle>
            <DialogDescription>
              Kept through responsive changes.
            </DialogDescription>
            <Input
              aria-label="Independent dialog draft"
              defaultValue="One form"
            />
          </DialogContent>
        </Dialog>
      </section>
      <section>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Independent popover</Button>
          </PopoverTrigger>
          <PopoverContent>Anchored content</PopoverContent>
        </Popover>
      </section>
      <section>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Independent menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Consumer action</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      <section>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Independent hint</Button>
            </TooltipTrigger>
            <TooltipContent>Extra context</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
    </>
  );
}
