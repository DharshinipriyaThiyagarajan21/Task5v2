namespace :update_date do
    desc "automatic updates of dates"
    task :backlog  => :environment do
        puts "world"
    
        Task.where(:day => 0,:completed => false).each do |task|
            count = task.backlog_count
            count = count + 1
             puts "hello"
            task.update(:backlog_count => count, :day => nil, :taken => false) 
        end
        Task.where(:day => 1,:completed => false).update(:day => 0)
        Task.where(:day => 2,:completed => false).update(:day => 1)
        puts "naveen"
        Task.where(:day => 3,:completed => false).update(:day => 2)
        Task.where(:day => 4,:completed => false).update(:day => 3)
        Task.where(:day => 5,:completed => false).update(:day => 4)   
            File.open("cron.txt","w") do |f|
                f.write(Time.now.to_s)
        end
    end
  end