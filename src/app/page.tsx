import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex items-center gap-4">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Create new workflow config</CardTitle>
                        <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <Input type="text" placeholder="Workflow name" />
                            <div className="flex items-center space-x-2">
                                <Switch id="audit-trail" />
                                <Label htmlFor="audit-trail">Audit Trail</Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-lg">Marking Store</p>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a marking stor type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="single_state">Single State</SelectItem>
                                            <SelectItem value="multiple_state">Multiple State</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p>Property</p>
                                <Input type="text" placeholder="Property" value="currentPlace" />
                            </div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a workflow type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="state_machine">State Machine</SelectItem>
                                        <SelectItem value="workflow">Workflow</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Create new workflow config</CardTitle>
                        <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </main>
    );
}
